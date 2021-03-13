const { readRaw } = require('../utils/file-io');

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

const nthTermFrom = (term, n) => {
  while (n--) {
    term = nextTerm(term);
  }

  return term;
};

const term = readRaw('input.txt');

console.log(nthTermFrom(term, 40).length, nthTermFrom(term, 50).length);
