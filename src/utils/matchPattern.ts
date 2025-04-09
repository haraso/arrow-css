import { Token } from "../tokenizer";

export interface Query {
  collectToken?: {
    neq?: string[];
    eq?: string[];
  };
  skipToken?: {
    neq?: string[];
    eq?: string[];
  };
  goToNext: {
    neq?: string[];
    eq?: string[];
  };
  unmatch?: {
    neq?: string[];
    eq?: string[];
  };
}

export function matchPattern(tokens: Token[], queries: Query[]) {
  const results: Token[][] = [];
  let resultIdx = 0;
  let queryIdx = 0;
  for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
    const token = tokens[tokenIdx];
    const query = queries[queryIdx];
    if (!query)
      return {
        match: true,
        results,
      };

    if (
      query.unmatch?.eq?.includes(token.type) ||
      query.unmatch?.neq?.includes(token.type) === false
    ) {
      return {
        match: false,
        results,
      };
    }
    let skipToken = false;
    if (
      query.skipToken?.eq?.includes(token.type) ||
      query.skipToken?.neq?.includes(token.type) === false
    ) {
      skipToken = true;
    }
    if (
      !skipToken &&
      (query.collectToken?.eq?.includes(token.type) ||
        query.collectToken?.neq?.includes(token.type) === false)
    ) {
      const result = (results[resultIdx] = results[resultIdx] || []);
      result.push(token);
    }
    if (
      query.goToNext?.eq?.includes(token.type) ||
      query.goToNext?.neq?.includes(token.type) === false
    ) {
      queryIdx++;
      if (!skipToken) tokenIdx--;
      if (resultIdx in results) resultIdx++;
      continue;
    }
  }

  return {
    match: true,
    results,
  };
}
