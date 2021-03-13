const { readLines } = require('../utils/file-io');

const getLengthAfterReplacements = (str, replacements) =>
  replacements.reduce((str, { regex, replacement }) => str.replace(regex, replacement), str).length;

const getLengthDecoded = str => getLengthAfterReplacements(
  str, [
    { regex: /^"/, replacement: '' },
    { regex: /"$/, replacement: '' },
    { regex: /\\\\/g, replacement: '\\' },
    { regex: /\\"/g, replacement: '"' },
    { regex: /\\x[a-f0-9]{2}/g, replacement: 'x' },
  ]
);

const getLengthEncoded = str => getLengthAfterReplacements(
  str, [
    { regex: /\\/g, replacement: '\\\\' },
    { regex: /"/g, replacement: '\\"' },
    { regex: /"$/, replacement: '\\""' },
    { regex: /^"/, replacement: '"\\"' },
  ]
);

let lengthRaw = 0;
let lengthDecoded = 0;
let lengthEncoded = 0;

readLines('input.txt').forEach(line => {
  lengthRaw += line.length;
  lengthDecoded += getLengthDecoded(line);
  lengthEncoded += getLengthEncoded(line);
});

console.log(lengthRaw - lengthDecoded, lengthEncoded - lengthRaw);
