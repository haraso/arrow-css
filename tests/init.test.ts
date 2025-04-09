import "../src";

test("init", () => {
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;
  const styleElementExtra = document.head.querySelector(
    "style[name='arrow-css-extra']"
  )!;
  expect(styleElement).not.toBeUndefined();
  expect(styleElementExtra).not.toBeUndefined();
});
