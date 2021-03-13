const { readLines } = require('../utils/file-io');

const toDecimal = (ref, upperChar) => [...ref].reduce(
  (decimal, char, index) => decimal | (upperChar === char ? 1 << (ref.length - index - 1) : 0),
  0
);

const seatIds = readLines('input.txt').map(line => {
  const row = toDecimal(line.slice(0, 7), 'B');
  const column = toDecimal(line.slice(7, 10), 'R');

  return row * 8 + column;
});

const part1 = seatIds => Math.max(...seatIds);

const part2 = seatIds => {
  const sum = seatIds.reduce((sum, seatId) => sum + seatId, 0);
  const sum1toN = n => .5 * n * (n + 1);

  return sum1toN(Math.max(...seatIds)) - sum1toN(Math.min(...seatIds) - 1) - sum;
};

console.log(part1(seatIds), part2(seatIds));
