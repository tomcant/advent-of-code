const { readLines } = require('../../utils/file-io');

const numbers = readLines('input.txt').map(Number);

const findFirstInvalidNumber = (numbers, preambleLength) => {
  const preamble = numbers.slice(0, preambleLength);
  const sumToFind = numbers[preambleLength];

  for (const number of preamble) {
    if (preamble.filter(n => number !== n).includes(sumToFind - number)) {
      return findFirstInvalidNumber(numbers.slice(1), preambleLength);
    }
  }

  return sumToFind;
};

const findEncryptionWeakness = (numbers, firstInvalidNumber) => {
  for (let i = 0, sum = 0; sum < firstInvalidNumber; ++i) {
    sum += numbers[i];

    if (sum === firstInvalidNumber) {
      const slice = numbers.slice(0, i);

      return Math.min(...slice) + Math.max(...slice);
    }
  }

  return null;
};

const part1 = numbers => findFirstInvalidNumber(numbers, 25);

const part2 = numbers => {
  const firstInvalidNumber = part1(numbers);

  for (let i = 0; i < numbers.length; ++i) {
    const weakness = findEncryptionWeakness(numbers.slice(i), firstInvalidNumber);

    if (null !== weakness) {
      return weakness;
    }
  }

  return null;
};

console.log(part1(numbers), part2(numbers));
