const { readLines } = require('../../utils/file-io');

const part1 = passwords => passwords.reduce(
  (validCount, [min, max, char, password]) => {
    const charCount = password.match(RegExp(char, 'g'))?.length;
    return validCount + (charCount >= min && charCount <= max);
  },
  0
);

const part2 = passwords => passwords.reduce(
  (validCount, [posOne, posTwo, char, password]) => {
    const [charOne, charTwo] = [password[posOne - 1], password[posTwo - 1]];
    return validCount + ((charOne === char) ^ (charTwo === char));
  },
  0
);

const passwords = readLines('input.txt').map(line => line.match(/(\d+)-(\d+) (.): (.+)/).slice(1));

console.log(part1(passwords), part2(passwords));
