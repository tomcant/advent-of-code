const { readLines } = require('../utils/file-io');

const buildCombinationLengthsMap = (numbers, target) => {
  const map = new Map();

  for (const comb of combinations(numbers)) {
    if (target === comb.reduce((sum, number) => sum + number, 0)) {
      map.set(comb.length, map.get(comb.length) + 1 || 1);
    }
  }

  return map;
};

const combinations = numbers => {
  if (0 === numbers.length) {
    return [[]];
  }

  const [head, ...tail] = numbers;
  const withoutHead = combinations(tail);
  const withHead = withoutHead.map(comb => [head, ...comb]);

  return [...withHead, ...withoutHead];
};

const part1 = lengthsMap => [...lengthsMap].reduce((total, [, subtotal]) => total + subtotal, 0);
const part2 = lengthsMap => [...lengthsMap].sort(([a], [b]) => b - a).map(([, subtotal]) => subtotal).pop();

const lengthsMap = buildCombinationLengthsMap(readLines('input.txt').map(Number), 150);

console.log(part1(lengthsMap), part2(lengthsMap));
