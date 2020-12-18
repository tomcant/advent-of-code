const { readRaw } = require('../../utils/file-io');

const findNthTerm = (numbers, n) => {
  let last = numbers.pop();
  const seen = new Map(numbers.map((n, i) => [n, i + 1]));

  for (let i = numbers.length + 1; i < n; ++i) {
    const term = seen.has(last) ? i - seen.get(last) : 0;
    seen.set(last, i);
    last = term;
  }

  return last;
};

const part1 = numbers => findNthTerm(numbers, 2020);
const part2 = numbers => findNthTerm(numbers, 30000000);

const numbers = readRaw('input.txt').split(',').map(Number);

console.log(part1([...numbers]), part2([...numbers]));
