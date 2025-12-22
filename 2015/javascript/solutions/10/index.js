const { readRaw } = require('../../utils/file-io');

const part1 = term => nthTermFrom(term, 40).length;
const part2 = term => nthTermFrom(term, 50).length;

const nthTermFrom = (term, n) => {
  while (n--) {
    term = nextTerm(term);
  }

  return term;
};

const nextTerm = term => {
  let [next, count, i] = ['', 1, 1];

  do {
    if (term[i] !== term[i - 1]) {
      next += count + term[i - 1];
      count = 0;
    }
    count += 1;
  } while (i++ < term.length);

  return next;
};

const term = readRaw('input.txt');

console.log('Part 1:', part1(term));
console.log('Part 2:', part2(term));
