enum Syntax {
  StartPair = "[",
  EndPair = "]",
}

type Token = number | Syntax;
type Num = Token[];

const DEPTH_DIFFS = { [Syntax.StartPair]: 1, [Syntax.EndPair]: -1 };

export const parseInput = (input: string): Num[] =>
  input.split("\n").map((line) =>
    line
      .split("")
      .filter((token) => token !== ",")
      .map((token) => (isSyntactic(token) ? token : Number(token)))
  );

export const part1 = (nums: Num[]): number =>
  magnitude(nums.reduce((sum, num) => add(sum, num)));

export const part2 = (nums: Num[]): number => {
  let largestMagnitude = 0;

  for (let i = 0; i < nums.length; ++i) {
    for (let j = 0; j < nums.length; ++j) {
      if (i === j) continue;

      largestMagnitude = Math.max(
        largestMagnitude,
        magnitude(add(nums[i], nums[j]))
      );
    }
  }

  return largestMagnitude;
};

const add = (left: Num, right: Num): Num =>
  reduce([Syntax.StartPair, ...left, ...right, Syntax.EndPair]);

const reduce = (tokens: Num): Num => {
  let startLen;

  do {
    startLen = tokens.length;
    processNextExplosion(tokens);

    if (tokens.length === startLen) {
      processNextSplit(tokens);
    }
  } while (tokens.length !== startLen);

  return tokens;
};

const processNextExplosion = (tokens: Num) => {
  for (let i = 0, depth = 0; i < tokens.length; ++i) {
    if (!isSyntactic(tokens[i])) continue;
    depth += DEPTH_DIFFS[tokens[i]];

    if (tokens[i] === Syntax.EndPair && depth === 4) {
      for (let j = i - 4; ; --j) {
        if (!isSyntactic(tokens[j])) {
          (tokens[j] as number) += tokens[i - 2] as number;
          break;
        }
      }

      for (let j = i + 1; j < tokens.length; ++j) {
        if (!isSyntactic(tokens[j])) {
          (tokens[j] as number) += tokens[i - 1] as number;
          break;
        }
      }

      tokens.splice(i - 3, 4, 0);

      return;
    }
  }
};

const processNextSplit = (tokens: Num) => {
  const index = tokens.findIndex((token) => !isSyntactic(token) && token >= 10);

  if (index > 0) {
    const left = Math.floor((tokens[index] as number) / 2);
    const right = Math.ceil((tokens[index] as number) / 2);
    tokens.splice(index, 1, Syntax.StartPair, left, right, Syntax.EndPair);
  }
};

const magnitude = (tokens: Num): number => {
  if (tokens.length === 1) {
    return tokens[0] as number;
  }

  let left = [];
  let depth = 0;

  for (let i = 1; i < tokens.length; ++i) {
    left.push(tokens[i]);

    if ((depth += DEPTH_DIFFS[tokens[i]] || 0) === 0) {
      return 3 * magnitude(left) + 2 * magnitude(tokens.slice(i + 1, -1));
    }
  }
};

const isSyntactic = (token: any): token is Syntax =>
  token === Syntax.StartPair || token === Syntax.EndPair;
