import { Action } from "./types";
import { isTextElement, redrawTextBoundingBox } from "../element";
import { META_KEY } from "../keys";

let copiedStyles: string = "{}";

export const actionCopyStyles: Action = {
  name: "copyStyles",
  perform: elements => {
    const element = elements.find(el => el.isSelected);
    if (element) {
      copiedStyles = JSON.stringify(element);
    }
    return {};
  },
  contextItemLabel: "Copy Styles",
  keyTest: event => event[META_KEY] && event.shiftKey && event.code === "KeyC",
  contextMenuOrder: 0
};

export const actionPasteStyles: Action = {
  name: "pasteStyles",
  perform: elements => {
    const pastedElement = JSON.parse(copiedStyles);
    return {
      elements: elements.map(element => {
        if (element.isSelected) {
          const newElement = {
            ...element,
            backgroundColor: pastedElement?.backgroundColor,
            strokeWidth: pastedElement?.strokeWidth,
            strokeColor: pastedElement?.strokeColor,
            fillStyle: pastedElement?.fillStyle,
            opacity: pastedElement?.opacity,
            roughness: pastedElement?.roughness
          };
          if (isTextElement(newElement)) {
            newElement.font = pastedElement?.font;
            redrawTextBoundingBox(newElement);
          }
          return newElement;
        }
        return element;
      })
    };
  },
  contextItemLabel: "Paste Styles",
  keyTest: event => event[META_KEY] && event.shiftKey && event.code === "KeyV",
  contextMenuOrder: 1
};
