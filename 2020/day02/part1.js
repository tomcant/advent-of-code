const { readLines } = require('../../utils/file-io');

let validCount = 0;

readLines('input.txt').forEach(line => {
  const [, min, max, char, password] = line.match(/(\d+)-(\d+) (.): (.+)/);
  const charCount = [...password].reduce((count, thisChar) => count + (char === thisChar), 0);

  validCount += charCount >= min && charCount <= max;
});

console.log(validCount);
