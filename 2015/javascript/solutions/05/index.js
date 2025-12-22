const { readLines } = require('../../utils/file-io');

const part1 = strs => strs.reduce(
  (cnt, str) => cnt + (/[aeiou].*[aeiou].*[aeiou]/.test(str) && /(.)\1/.test(str) && !/(ab|cd|pq|xy)/.test(str)),
  0
);

const part2 = strs => strs.reduce((cnt, str) => cnt + (/(..).*\1/.test(str) && /(.).\1/.test(str)), 0);

const strs = readLines('input.txt');

console.log('Part 1:', part1(strs));
console.log('Part 2:', part2(strs));
