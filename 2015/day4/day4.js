const secret = require('./input');
const crypto = require('crypto');

for (let prefix of ['00000', '000000']) {
  let n = 1, hash;

  do hash = crypto.createHash('md5').update(secret + n).digest('hex');
  while (hash.substr(0, prefix.length) !== prefix && ++n);

  console.log(n);
}
