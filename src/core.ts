import { createDOMObserver } from "./utils/createDOMObserver";
import { processClassName } from "./processClassName";
import { createList } from "./utils/createList";

const rootStyleElement = document.createElement("style");
rootStyleElement.setAttribute("name", "arrow-css");
document.head.appendChild(rootStyleElement);

const classNameStore = createList<Text>();

function preProcessClassName(
  className: string,
  idx: number,
  classNames: string[]
) {
  if (!className.includes("=>")) return;
  if (classNameStore.has(className)) {
    const { itemBefore, item } = classNameStore.setWeight(
      className,
      idx / classNames.length
    );
    if (itemBefore) itemBefore.after(item);
    else if (rootStyleElement.firstChild)
      rootStyleElement.firstChild.before(item);
    else rootStyleElement.appendChild(item);
  } else {
    const textNode = processClassName(className);
    if (!textNode) return;
    const { itemBefore, item } = classNameStore.addItem(
      className,
      idx / classNames.length,
      textNode
    );
    if (itemBefore) itemBefore.after(item);
    else if (rootStyleElement.firstChild)
      rootStyleElement.firstChild.before(item);
    else rootStyleElement.appendChild(item);
  }
}

function delClassName(className: string, idx: number, classNames: string[]) {
  if (!classNameStore.has(className)) return;
  const { deleted, item, itemBefore } = classNameStore.delItem(
    className,
    idx / classNames.length
  );
  if (deleted) {
    item.remove();
    return;
  }

  if (itemBefore) itemBefore.after(item);
  else if (rootStyleElement.firstChild)
    rootStyleElement.firstChild.before(item);
  else rootStyleElement.appendChild(item);
}

const observer = createDOMObserver({
  createAttributes: ["class"],
  modifyAttributes: ["class"],
});

observer.onCreate((element) => {
  const classes = element.className.split(" ");
  classes.forEach(preProcessClassName);
});

observer.onModify((_, oldValue, newValue) => {
  const newClassNames = newValue!.split(" ");
  const oldClassNames = oldValue!.split(" ");

  oldClassNames.forEach(delClassName);
  newClassNames.forEach(preProcessClassName);
});

observer.onDelete((element) => {
  const classNames = element.className.split(" ");
  classNames.forEach(delClassName);
});

export const run = () => observer.start();
export const stop = () => observer.stop();
