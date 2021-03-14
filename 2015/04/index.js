const { createHash } = require('crypto');
const { readRaw } = require('../utils/file-io');

const part1 = secret => findHash(secret, 5);
const part2 = secret => findHash(secret, 6);

const findHash = (secret, prefixLength) => {
  const prefix = '0'.repeat(prefixLength);
  let n = 1;
  let hash;

  do hash = createHash('md5').update(secret + n).digest('hex');
  while (hash.substr(0, prefix.length) !== prefix && ++n);

  return n;
};

const secret = readRaw('input.txt');

console.log('Part 1:', part1(secret));
console.log('Part 2:', part2(secret));
