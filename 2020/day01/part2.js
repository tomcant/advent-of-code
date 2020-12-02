const { readLines } = require('../../utils/file-io');

const threeSum = (sum, numbers) => {
  const set = new Set(numbers);

  for (const first of numbers) {
    for (const second of numbers) {
      if (set.has(sum - first - second)) {
        return first * second * (sum - first - second);
      }
    }
  }

  return null;
};

console.log(threeSum(2020, readLines('input.txt').map(n => +n)));
