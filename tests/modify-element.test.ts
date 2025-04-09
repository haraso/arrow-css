import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("modify element test", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;
  const div = document.createElement("div");
  div.className = "class=>color:red";
  document.body.appendChild(div);

  await wait();

  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:red { color: red; }"
  );

  div.className = "class=>color:black";

  await wait();

  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:black { color: black; }"
  );

  ArrowCSS.stop();
});
