import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("delete element test", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;

  const redDiv = document.createElement("div");
  redDiv.className = "class=>color:red";
  document.body.appendChild(redDiv);

  const blackDiv = document.createElement("div");
  blackDiv.className = "class=>color:black";
  document.body.appendChild(blackDiv);

  await wait();

  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:red { color: red; }"
  );
  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:black { color: black; }"
  );

  blackDiv.remove();

  await wait();

  expect(styleElement.innerHTML).toContain(
    ".class\\=\\>color\\:red { color: red; }"
  );
  expect(styleElement.innerHTML).not.toContain(
    ".class\\=\\>color\\:black { color: black; }"
  );

  ArrowCSS.stop();
});
