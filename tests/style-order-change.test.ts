import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("style order change", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;
  const div = document.createElement("div");
  div.className = "class=>color:red class=>display:flex";
  document.body.appendChild(div);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } .class\\=\\>display\\:flex { display: flex; } "
  );

  div.className = "class=>display:flex class=>color:red";

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>display\\:flex { display: flex; } .class\\=\\>color\\:red { color: red; } "
  );

  ArrowCSS.stop();
});
