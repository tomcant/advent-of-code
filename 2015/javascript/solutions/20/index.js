const { readRaw } = require('../../utils/file-io');

const part1 = minPresents => findFirstHouseWithMinPresents(minPresents, 10, Infinity);
const part2 = minPresents => findFirstHouseWithMinPresents(minPresents, 11, 50);

const findFirstHouseWithMinPresents = (minPresents, presentsPerHouse, maxPresentsPerElf) => {
  let sum, houseNumber = 1;

  do sum = presentsPerHouse * sumOfDivisorsWithFactorLimit(houseNumber++, maxPresentsPerElf);
  while (sum < minPresents);

  return houseNumber - 1;
};

const sumOfDivisorsWithFactorLimit = (n, factorLimit) => {
  if (1 === n) {
    return 1;
  }

  let sum = n + 1;
  const sqrt = Math.sqrt(n);

  for (let factor = 2; factor <= Math.floor(sqrt); ++factor) {
    if (n % factor === 0) {
      if (n <= factor * factorLimit) {
        sum += factor;
      }

      if (factor !== sqrt && n <= (n / factor) * factorLimit) {
        sum += n / factor;
      }
    }
  }

  return sum;
};

const minPresents = readRaw('input.txt');

console.log('Part 1:', part1(minPresents));
console.log('Part 2:', part2(minPresents));
