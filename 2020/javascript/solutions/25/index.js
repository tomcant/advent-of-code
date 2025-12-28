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

const part1 = (cardKey, doorKey) => transform(cardKey, findLoopSize(doorKey));

console.log('Part 1:', part1(cardKey, doorKey));
