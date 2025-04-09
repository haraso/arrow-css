import { blockGrammar, entryGrammar } from "./grammars";
import {
  createBlockNode,
  createEntryNode,
  createRootNode,
  NODE_TYPES,
} from "./nodes";
import { Token } from "./tokenizer";
import { logSyntaxError } from "./utils/logSyntaxError";

export function toAST(tokens: Token[]) {
  const rootNode = createRootNode();
  const stack = [rootNode];
  let currentBlockNode = rootNode;

  for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
    const entryPattern = entryGrammar(tokens.slice(tokenIdx));
    if (entryPattern.match) {
      const [keyTokens, valueTokens] = entryPattern.results;
      const tokens = valueTokens || keyTokens;
      tokenIdx = tokens[tokens.length - 1].tokenIdx + 1;
      const entryNode = createEntryNode(keyTokens, valueTokens);
      currentBlockNode.children.push(entryNode);
      continue;
    }

    const blockPattern = blockGrammar(tokens.slice(tokenIdx));
    if (blockPattern.match) {
      const [keyTokens] = blockPattern.results;
      tokenIdx = keyTokens[keyTokens.length - 1].tokenIdx + 1;
      const blockNode = createBlockNode(keyTokens);
      if (
        currentBlockNode.children[currentBlockNode.children.length - 1]
          ?.type === NODE_TYPES.entry
      ) {
        currentBlockNode = stack.pop()!;
      }
      currentBlockNode.children.push(blockNode);
      stack.push(currentBlockNode);
      currentBlockNode = blockNode;
      continue;
    }

    logSyntaxError(rootNode, tokens, tokenIdx);

    return null;
  }

  return rootNode;
}
