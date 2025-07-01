import { parseASTToCSS } from "./parseASTToCSS";
import { toAST } from "./toAST";
import { SYMBOLS_ARRAY, tokenizer } from "./tokenizer";
import { logASTError } from "./utils/logSyntaxError";

export function processClassName(className: string) {
  const tokens = tokenizer(className, SYMBOLS_ARRAY);
  const ast = toAST(tokens);
  if (!ast) {
    logASTError(className);
    return null;
  }

  const cssText = parseASTToCSS(ast, className);
  const textNode = document.createTextNode(cssText);

  return textNode;
}
