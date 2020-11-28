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

console.log(nthTermFrom(require('./input'), 40).length);
console.log(nthTermFrom(require('./input'), 50).length);
