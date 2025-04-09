export interface TextObj {
  wrapper: string[][];
  text: string;
  readonly fullText: string;
  push(textObj: TextObj): void;
}

export function createTextObj(defaultValue: string) {
  const textArr = [defaultValue];
  const wrapper: Array<any> = [textArr];
  return {
    wrapper,
    get fullText() {
      return wrapper.flat(Infinity).join("");
    },
    get text() {
      return textArr[0];
    },
    set text(value: string) {
      textArr[0] = value;
    },
    push(textObj: TextObj) {
      wrapper.push(textObj.wrapper);
    },
  };
}
