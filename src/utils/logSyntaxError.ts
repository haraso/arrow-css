import { Token } from "../tokenizer";

export function logSyntaxError(
  rootNode: any,
  tokens: Token[],
  tokenIdx: number
) {
  console.error(
    "[Arrow-CSS] Syntax error" +
      "\n\n" +
      tokens.map(({ value }) => value).join("") +
      "\n" +
      Array(tokens[tokenIdx].charIdx).fill(" ").join("") +
      Array(tokens[tokenIdx].value.length).fill("^").join("")
  );

  console.debug("[Arrow-CSS] tokens:", tokens);
  console.debug("[Arrow-CSS] ast:", rootNode);
}
