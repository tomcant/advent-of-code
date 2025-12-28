const { readLines } = require('../../utils/file-io');

function findOptimalArrangement(weights, numGroups) {
  const weightPerGroup = sum(weights) / numGroups;
  const sortedWeights = weights.sort((a, b) => b - a);

  let minQe = Infinity;
  let lastGroupSize = Infinity;

  for (const group of findGroups(sortedWeights, weightPerGroup)) {
    if (group.length > lastGroupSize && minQe < Infinity) {
      return minQe;
    }

    const remaining = new Set(weights.filter(w => !group.includes(w)));

    if (groupExists(remaining, weightPerGroup)) {
      minQe = Math.min(product(group), minQe);
    }

    lastGroupSize = group.length;
  }

  return minQe;
}

function* findGroups(weights, weightPerGroup) {
  const items = Array.from(weights);

  for (let size = 2; size <= items.length; ++size) {
    for (const combo of combinations(items, size)) {
      if (sum(combo) === weightPerGroup) {
        yield combo;
      }
    }
  }
}

function groupExists(weights, weightPerGroup) {
  const gen = findGroups(weights, weightPerGroup);
  const { done } = gen.next();
  return !done;
}

function* combinations(items, size, start = 0, prefix = []) {
  if (prefix.length === size) {
    yield prefix;
    return;
  }

  for (let i = start; i <= items.length - (size - prefix.length); i++) {
    yield* combinations(items, size, i + 1, [...prefix, items[i]]);
  }
}

const sum = nums => nums.reduce((a, b) => a + b, 0);
const product = nums => nums.reduce((acc, n) => acc * n, 1);

const part1 = weights => findOptimalArrangement(weights, 3);
const part2 = weights => findOptimalArrangement(weights, 4);

const weights = readLines('input.txt').filter(Boolean).map(Number);

console.log('Part 1:', part1(weights));
console.log('Part 2:', part2(weights));
