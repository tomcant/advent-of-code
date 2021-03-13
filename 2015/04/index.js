const crypto = require('crypto');
const { readRaw } = require('../utils/file-io');

const secret = readRaw('input.txt');

for (let prefix of ['00000', '000000']) {
  let n = 1, hash;

  do hash = crypto.createHash('md5').update(secret + n).digest('hex');
  while (hash.substr(0, prefix.length) !== prefix && ++n);

  console.log(n);
}
