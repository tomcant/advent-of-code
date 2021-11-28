const { readLines } = require('../utils/file-io');

const part1 = numbers => {
  const diffs = { 1: 0, 3: 0 };

  for (let i = 1; i < numbers.length; ++i) {
    diffs[numbers[i] - numbers[i - 1]] += 1;
  }

  return diffs[1] * diffs[3];
};

const part2 = numbers => {
  const counts = [1].concat(new Array(numbers.length - 1).fill(0));

  for (let i = 1; i < numbers.length; ++i) {
    for (let j = 0; j < i; ++j) {
      if (numbers[i] - numbers[j] <= 3) {
        counts[i] += counts[j];
      }
    }
  }

  return counts.pop();
};

let numbers = readLines('input.txt').sort((a ,b) => a - b);
numbers = [0, numbers, 3 + Math.max(...numbers)].flat();

console.log(part1(numbers), part2(numbers));
