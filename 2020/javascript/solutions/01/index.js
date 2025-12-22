const { readLines } = require('../../utils/file-io');

const twoSum = (target, numbers) => {
  for (const number of numbers) {
    if (numbers.has(target - number)) {
      return number * (target - number);
    }
  }

  return null;
};

const threeSum = (target, numbers) => {
  for (const number of numbers) {
    const sum = twoSum(target - number, numbers);

    if (sum) {
      return number * sum;
    }
  }

  return null;
};

const part1 = numbers => twoSum(2020, numbers);
const part2 = numbers => threeSum(2020, numbers);

const numbers = new Set(readLines('input.txt').map(Number));

console.log(part1(numbers), part2(numbers));
