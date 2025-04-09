import { createDOMObserver } from "./utils/createDOMObserver";
import { processClassName } from "./processClassName";

const rootStyleElement = document.createElement("style");
rootStyleElement.setAttribute("name", "arrow-css");
document.head.appendChild(rootStyleElement);

const rootStyleExtraElement = document.createElement("style");
rootStyleExtraElement.setAttribute("name", "arrow-css-extra");
document.head.appendChild(rootStyleExtraElement);

function preProcessClassName(className: string) {
  if (!className.includes("=>")) return;
  if (className in classNameStore) {
    classNameStore[className].count++;
  } else {
    const { isExtra, textNode } = processClassName(className);
    classNameStore[className] = {
      count: 1,
      textNode,
    };
    if (textNode)
      if (isExtra) rootStyleExtraElement.appendChild(textNode);
      else rootStyleElement.appendChild(textNode);
  }
}

function delClassName(className: string) {
  if (!(className in classNameStore)) return;
  const classNameNode = classNameStore[className];
  classNameNode.count--;
  if (classNameNode.count === 0) {
    classNameNode.textNode?.remove();
    delete classNameStore[className];
  }
}

const classNameStore: Record<string, { textNode?: Text; count: number }> = {};
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
  const addedClassNames: string[] = [];
  const deletedClassNames: string[] = [];
  newClassNames.forEach((className) => {
    if (oldClassNames.includes(className)) return;
    addedClassNames.push(className);
  });
  oldClassNames.forEach((className) => {
    if (newClassNames.includes(className)) return;
    deletedClassNames.push(className);
  });

  addedClassNames.forEach(preProcessClassName);

  deletedClassNames.forEach(delClassName);
});

observer.onDelete((element) => {
  const classNames = element.className.split(" ");
  classNames.forEach(delClassName);
});

export const run = () => observer.start();
export const stop = () => observer.stop();
