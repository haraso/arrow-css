import { Token, TOKEN_TYPES } from "./tokenizer";
import { matchPattern, Query } from "./utils/matchPattern";

function createGrammar(...queries: Query[]) {
  return (tokens: Token[]) => matchPattern(tokens, queries);
}

export const entryGrammar = createGrammar(
  {
    unmatch: {
      eq: [TOKEN_TYPES.colon, TOKEN_TYPES.semicolon, TOKEN_TYPES.arrow],
    },
    goToNext: {
      neq: [TOKEN_TYPES.colon, TOKEN_TYPES.semicolon, TOKEN_TYPES.arrow],
    },
  },
  {
    unmatch: {
      eq: [TOKEN_TYPES.arrow],
    },
    goToNext: { eq: [TOKEN_TYPES.colon, TOKEN_TYPES.semicolon] },
    skipToken: { eq: [TOKEN_TYPES.colon] },
    collectToken: { neq: [TOKEN_TYPES.colon, TOKEN_TYPES.semicolon] },
  },
  {
    unmatch: { eq: [TOKEN_TYPES.arrow] },
    goToNext: { eq: [TOKEN_TYPES.semicolon] },
    skipToken: { eq: [TOKEN_TYPES.semicolon] },
    collectToken: { neq: [TOKEN_TYPES.semicolon] },
  }
);

export const blockGrammar = createGrammar(
  {
    unmatch: {
      eq: [TOKEN_TYPES.arrow],
    },
    goToNext: {
      neq: [TOKEN_TYPES.arrow],
    },
  },
  {
    unmatch: {
      eq: [TOKEN_TYPES.semicolon],
    },
    goToNext: { eq: [TOKEN_TYPES.arrow] },
    skipToken: { eq: [TOKEN_TYPES.arrow] },
    collectToken: { neq: [TOKEN_TYPES.arrow] },
  }
);
