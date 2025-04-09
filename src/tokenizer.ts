export interface Token {
  type: string;
  value: string;
  tokenIdx: number;
  charIdx: number;
}

const SYMBOLS = {
  colon: ":",
  semicolon: ";",
  arrow: "=>",
};

export const SYMBOLS_ARRAY = Object.values(SYMBOLS);

export const TOKEN_TYPES = {
  ...SYMBOLS,
  word: "word",
};

function isSymbol(text: string, start: number, symbol: string) {
  for (let symbolCharIdx = 0; symbolCharIdx < symbol.length; symbolCharIdx++) {
    const textIdx = symbolCharIdx + start;
    if (text[textIdx] !== symbol[symbolCharIdx]) return false;
  }
  return true;
}

export function tokenizer(text: string, symbols: string[]) {
  const tokens: Token[] = [];
  for (let charIdx = 0; charIdx < text.length; charIdx++) {
    let char = text[charIdx];
    let isCurrentSymbol = false;
    for (let symbolIdx = 0; symbolIdx < symbols.length; symbolIdx++) {
      const symbol = symbols[symbolIdx];
      if (isSymbol(text, charIdx, symbol)) {
        isCurrentSymbol = true;
        tokens.push({
          type: symbol,
          value: symbol,
          charIdx,
          tokenIdx: tokens.length,
        });
        charIdx += symbol.length - 1;
        break;
      }
    }
    if (isCurrentSymbol) continue;
    let token = tokens[tokens.length - 1];
    if (token?.type !== TOKEN_TYPES.word) {
      token = {
        type: TOKEN_TYPES.word,
        value: "",
        charIdx,
        tokenIdx: tokens.length,
      };
      tokens.push(token);
    }
    token.value += char;
  }
  return tokens;
}
