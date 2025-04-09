import { ArrowCSS } from "../src";

test("post run test", () => {
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;
  const div = document.createElement("div");
  div.className = "class=>color:red";
  document.body.appendChild(div);

  ArrowCSS.run();
  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:red { color: red; }"
  );
  ArrowCSS.stop();
});
