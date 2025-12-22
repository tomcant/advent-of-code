const { readLines } = require('../../utils/file-io');

const part1 = strs => getLengthDiffAfterReplacements(
  strs, [
    { regex: /^"/, replacement: '' },
    { regex: /"$/, replacement: '' },
    { regex: /\\\\/g, replacement: '\\' },
    { regex: /\\"/g, replacement: '"' },
    { regex: /\\x[a-f0-9]{2}/g, replacement: 'x' },
  ]
);

const part2 = strs => getLengthDiffAfterReplacements(
  strs, [
    { regex: /\\/g, replacement: '\\\\' },
    { regex: /"/g, replacement: '\\"' },
    { regex: /"$/, replacement: '\\""' },
    { regex: /^"/, replacement: '"\\"' },
  ]
);

const getLengthDiffAfterReplacements = (strs, replacements) => {
  const lenRaw = strs.reduce((len, str) => len + str.length, 0);

  const lenReplaced = strs.reduce(
    (len, str) => len + replacements.reduce(
      (str, { regex, replacement }) => str.replace(regex, replacement),
      str
    ).length,
    0
  );

  return Math.abs(lenRaw - lenReplaced);
};

const strs = readLines('input.txt');

console.log('Part 1:', part1(strs));
console.log('Part 2:', part2(strs));
