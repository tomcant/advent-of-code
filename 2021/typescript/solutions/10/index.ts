export const parseInput = (input: string): string[] => input.split("\n");

const tokenPairMap = {
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
};

class SyntaxError extends Error {
  constructor(readonly token) {
    super();
    this.token = token;
  }
}

export const part1 = (lines: string[]): number => {
  const tokenScores = { ")": 3, "]": 57, "}": 1197, ">": 25137 };
  let score = 0;

  for (const line of lines) {
    try {
      findIncompleteTokens(line);
    } catch (err) {
      score += tokenScores[err.token];
    }
  }

  return score;
};

export const part2 = (lines: string[]): number => {
  const tokenScores = { ")": 1, "]": 2, "}": 3, ">": 4 };
  const scores = [];

  for (const line of lines) {
    try {
      scores.push(
        findIncompleteTokens(line)
          .map((token) => tokenPairMap[token])
          .reduceRight((score, token) => score * 5 + tokenScores[token], 0)
      );
    } catch (err) {}
  }

  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};

const findIncompleteTokens = (line: string): string[] => {
  const stack = [];

  for (const token of [...line]) {
    if (["(", "[", "{", "<"].includes(token)) {
      stack.push(token);
      continue;
    }
    if (tokenPairMap[token] !== stack.pop()) {
      throw new SyntaxError(token);
    }
  }

  return stack;
};
