import { ArrowCSS } from "../src";

function wait(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test("text change error", async () => {
  ArrowCSS.run();
  const div = document.createElement("div");
  div.className = "class=>color:red class=>display:flex";
  document.body.appendChild(div);
  const textNode = document.createTextNode("class");
  div.appendChild(textNode);

  await wait();

  textNode.remove();

  await wait();

  ArrowCSS.stop();
});
