import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("style order change by weight", async () => {
  ArrowCSS.run();
  const styleElement = document.head.querySelector("style[name='arrow-css']")!;
  const div1 = document.createElement("div");
  div1.className = "class=>color:red class=>display:flex";
  document.body.appendChild(div1);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } .class\\=\\>display\\:flex { display: flex; } "
  );

  const div2 = document.createElement("div");
  div2.className = "class=>display:flex class=>color:red";
  document.body.appendChild(div2);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>color\\:red { color: red; } .class\\=\\>display\\:flex { display: flex; } "
  );

  const div3 = document.createElement("div");
  div3.className = "class=>display:flex class=>color:red";
  document.body.appendChild(div3);

  await wait();

  expect(styleElement.innerHTML).toBe(
    ".class\\=\\>display\\:flex { display: flex; } .class\\=\\>color\\:red { color: red; } "
  );

  ArrowCSS.stop();
});
