interface ObserveOptions {
  createAttributes?: string[];
  modifyAttributes?: string[];
}

export function createDOMObserver(options: ObserveOptions) {
  let onCreate: (element: HTMLElement) => void = () => {};
  let onModify: (
    element: HTMLElement,
    oldValue: string | null,
    newValue: string | null
  ) => void = () => {};
  let onDelete: (element: HTMLElement) => void = () => {};

  const { createAttributes = [], modifyAttributes = [] } = options;

  const eventHandler: EventListener = (event) => {
    const target = event.target as HTMLElement;

    // new element
    if (
      event.type === "DOMNodeInserted" &&
      createAttributes.some((attr) => target.hasAttribute(attr))
    ) {
      onCreate(target as HTMLElement);
    }

    // modify attr
    if (
      event.type === "DOMAttrModified" &&
      modifyAttributes.includes((event as any).attrName)
    ) {
      const oldValue = (event as any).prevValue;
      const newValue = target.getAttribute((event as any).attrName);
      onModify(target as HTMLElement, oldValue, newValue);
    }

    // del element
    if (
      event.type === "DOMNodeRemoved" &&
      createAttributes
        .concat(modifyAttributes)
        .some((attr) => target.hasAttribute(attr))
    ) {
      onDelete(target as HTMLElement);
    }
  };

  const checkOnCreated = (node: Node) => {
    if (!(node instanceof HTMLElement)) return;
    if (createAttributes.some((attr) => node.hasAttribute(attr))) {
      onCreate(node);
    }
  };

  const checkOnDeleted = (node: Node) => {
    if (!(node instanceof HTMLElement)) return;
    if (
      createAttributes
        .concat(modifyAttributes)
        .some((attr) => node.hasAttribute(attr))
    ) {
      onDelete(node);
    }
  };

  let observer: MutationObserver | null = null;
  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          checkOnCreated(node);
          node.querySelectorAll("*").forEach(checkOnCreated);
        });

        if (
          mutation.type === "attributes" &&
          mutation.attributeName &&
          modifyAttributes.includes(mutation.attributeName)
        ) {
          const oldValue = mutation.oldValue;
          const newValue = (mutation.target as HTMLElement).getAttribute(
            mutation.attributeName
          );
          onModify(mutation.target as HTMLElement, oldValue, newValue);
        }

        // del element
        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          checkOnDeleted(node);
          node.querySelectorAll("*").forEach(checkOnDeleted);
        });
      });
    });
  }

  function checkExistingElements() {
    const elements = document.body.querySelectorAll("*");
    elements.forEach((element) => {
      if (createAttributes.some((attr) => element.hasAttribute(attr))) {
        onCreate(element as HTMLElement);
      }
    });
  }

  function start() {
    checkExistingElements();

    const attributes = [...new Set([...createAttributes, ...modifyAttributes])];
    if (observer) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: attributes,
        attributeOldValue: true,
      });
    } else {
      document.body.addEventListener("DOMNodeInserted", eventHandler);
      document.body.addEventListener("DOMAttrModified", eventHandler);
      document.body.addEventListener("DOMNodeRemoved", eventHandler);
    }
  }

  function stop() {
    if (observer) {
      observer.disconnect();
    } else {
      document.body.removeEventListener("DOMNodeInserted", eventHandler);
      document.body.removeEventListener("DOMAttrModified", eventHandler);
      document.body.removeEventListener("DOMNodeRemoved", eventHandler);
    }
  }

  return {
    start,
    stop,
    onCreate(handler: (element: HTMLElement) => void) {
      onCreate = handler;
    },
    onModify(
      handler: (
        element: HTMLElement,
        oldValue: string | null,
        newValue: string | null
      ) => void
    ) {
      onModify = handler;
    },
    onDelete(handler: (element: HTMLElement) => void) {
      onDelete = handler;
    },
  };
}
