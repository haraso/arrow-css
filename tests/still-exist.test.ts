import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test.only("still exist test", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;

  const div1 = document.createElement("div");
  div1.className = "class=>color:red";
  document.body.appendChild(div1);

  const div2 = document.createElement("div");
  div2.className = "class=>color:red";
  document.body.appendChild(div2);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } "
  );

  div1.remove();

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } "
  );

  ArrowCSS.stop();
});
