const { readLines } = require('../../utils/file-io');

const twoSum = (sum, numbers) => {
  const set = new Set(numbers);

  for (const number of numbers) {
    if (set.has(sum - number)) {
      return number * (sum - number);
    }
  }

  return null;
};

console.log(twoSum(2020, readLines('input.txt').map(n => +n)));
