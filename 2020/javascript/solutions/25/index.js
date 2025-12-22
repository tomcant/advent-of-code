const { readLines } = require('../../utils/file-io');

const [cardKey, doorKey] = readLines('input.txt').map(Number);

const findLoopSize = pubkey => {
  let result = 1;
  let loopSize = 0;

  while (result !== pubkey) {
    result *= 7;
    result %= 20201227;
    loopSize += 1;
  }

  return loopSize;
};

const transform = (subject, loopSize) => {
  let result = 1;

  while (loopSize--) {
    result *= subject;
    result %= 20201227;
  }

  return result;
};

console.log(transform(cardKey, findLoopSize(doorKey)));
