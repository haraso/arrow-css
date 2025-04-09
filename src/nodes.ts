import { Token, tokenizer } from "./tokenizer";
import { matchPattern, Query } from "./utils/matchPattern";

export const NODE_TYPES = {
  root: 0,
  text: 1,
  block: 2,
  entry: 3,
};

export interface ASTTextNode {
  type: number;
  text: string;
  tokenizer(symbolsArr: string[]): Token[];
  matchPattern(
    tokens: Token[],
    queries: Query[]
  ): {
    match: boolean;
    results: Token[][];
  };
}

export function createTextNode(tokens: Token[] = []): ASTTextNode {
  return {
    type: NODE_TYPES.text,
    text: tokens.map(({ value }) => value).join(""),
    tokenizer(symbolsArr: string[]) {
      return tokenizer(this.text, symbolsArr);
    },
    matchPattern,
  };
}

export interface ASTEntryNode {
  type: number;
  key: ASTTextNode;
  value: ASTTextNode;
}

export function createEntryNode(
  keyTokens: Token[] = [],
  valueTokens: Token[] = []
): ASTEntryNode {
  return {
    type: NODE_TYPES.entry,
    key: createTextNode(keyTokens),
    value: createTextNode(valueTokens),
  };
}

export interface ASTBlockNode {
  type: number;
  wrapper: ASTTextNode;
  children: (ASTBlockNode | ASTEntryNode | ASTTextNode)[];
}

export function createBlockNode(tokens: Token[] = []): ASTBlockNode {
  return {
    type: NODE_TYPES.block,
    wrapper: createTextNode(tokens),
    children: [],
  };
}

export interface ASTRootNode {
  type: number;
  children: (ASTBlockNode | ASTEntryNode | ASTTextNode)[];
}

export function createRootNode(): ASTRootNode {
  return {
    type: NODE_TYPES.root,
    children: [],
  };
}
