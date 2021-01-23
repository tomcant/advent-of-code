const { readRaw } = require('../../utils/file-io');

const calcCode = (row, col) => {
  let termNumber = calcTermNumber(row, col);
  let code = 20151125;

  while (--termNumber) {
    code *= 252533;
    code %= 33554393;
  }

  return code;
};

const calcTermNumber = (row, col) => 1 + row * (col - 1) + sum1toN(row - 1) + sum1toN(col - 1);
const sum1toN = n => .5 * n * (n + 1);

const [, row, col] = readRaw('input.txt').match(/row\s(\d+),\scolumn\s(\d+)/);

console.log(calcCode(+row, +col));
