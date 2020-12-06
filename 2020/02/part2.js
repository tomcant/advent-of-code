const { readLines } = require('../../utils/file-io');

let validCount = 0;

readLines('input.txt').forEach(line => {
  const [, posOne, posTwo, char, password] = line.match(/(\d+)-(\d+) (.): (.+)/);
  const [charOne, charTwo] = [password[posOne - 1], password[posTwo - 1]];

  validCount += charOne !== charTwo && (charOne === char || charTwo === char);
});

console.log(validCount);
