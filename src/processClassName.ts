import { parseASTToCSS } from "./parseASTToCSS";
import { toAST } from "./toAST";
import { SYMBOLS_ARRAY, tokenizer } from "./tokenizer";

export function processClassName(className: string) {
  const tokens = tokenizer(className, SYMBOLS_ARRAY);
  const ast = toAST(tokens);
  if (!ast) return {};

  const cssText = parseASTToCSS(ast, className);
  const textNode = document.createTextNode(cssText);
  const isExtra = cssText.includes("@") || cssText.includes(":hover");

  return {
    isExtra,
    textNode,
  };
}
