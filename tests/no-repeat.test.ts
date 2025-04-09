import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("delete element test", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;

  const redDiv1 = document.createElement("div");
  redDiv1.className = "class=>color:red";
  document.body.appendChild(redDiv1);

  const redDiv2 = document.createElement("div");
  redDiv2.className = "class=>color:red";
  document.body.appendChild(redDiv1);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } "
  );

  ArrowCSS.stop();
});
