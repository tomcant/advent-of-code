const { readRaw } = require('../utils/file-io');

console.log(readRaw('input.txt').match(/-?\d+/g).reduce((sum, n) => sum + +n, 0));
