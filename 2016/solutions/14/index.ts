import { createHash } from 'crypto';

type Key = {
  idx: number,
  hash: string,
  char: string
};

const findKey = (salt: string, keyNum: number, stretch: number = 0): Key => {
  const keys = [];
  const candidates = [];

  for (let idx = 0; keys.length < keyNum; ++idx) {
    const hash = genHash(salt + idx, stretch);
    const [chars, char] = /(.)\1{2}(\1{2})?/.exec(hash) ?? [''];

    if (chars.length >= 5) {
      keys.push(...candidates.filter(
        candidate => char === candidate.char && idx - candidate.idx <= 1000
      ));
    }

    if (chars.length >= 3) {
      candidates.push({ idx, hash, char });
    }
  }

  return keys.sort((a, b) => a.idx - b.idx)[keyNum - 1];
};

const genHash = (input: string, stretch: number): string => {
  let hashCount = stretch + 1;
  let hash = input;

  while (hashCount--) {
    hash = createHash('md5').update(hash).digest('hex');
  }

  return hash;
};

export const part1 = (salt: string): number => findKey(salt, 64).idx;
export const part2 = (salt: string): number => findKey(salt, 64, 2016).idx;

export const parseInput = (input: string): string => input;
