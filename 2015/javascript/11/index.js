const { readRaw } = require('../utils/file-io');

const part1 = currentPassword => findNextValidPassword(currentPassword);
const part2 = currentPassword => findNextValidPassword(findNextValidPassword(currentPassword));

const findNextValidPassword = password => {
  do password = incrementBase26(password);
  while (!isPasswordValid(password));

  return password;
};

const incrementBase26 = base26 => toBase26(toBase10(base26) + 1);

const toBase26 = base10 => {
  let base26 = '';

  while (base10) {
    base26 = String.fromCharCode((base10 % 26) + 'a'.charCodeAt(0)) + base26;
    base10 = Math.floor(base10 / 26);
  }

  return base26;
};

const toBase10 = base26 => [...base26].reduce(
  (base10, char, index) => base10 + 26 ** (base26.length - index - 1) * (char.charCodeAt(0) - 'a'.charCodeAt(0)),
  0
);

const isPasswordValid = password =>
  !/iol/.test(password) &&
  /(.)\1.*(.)\2/.test(password) &&
  containsThreeConsecutiveChars(password);

const containsThreeConsecutiveChars = str => {
  for (let i = 2; i < str.length; ++i) {
    if (
      str[i] === String.fromCharCode(str.charCodeAt(i - 1) + 1) &&
      str[i] === String.fromCharCode(str.charCodeAt(i - 2) + 2)
    ) {
      return true;
    }
  }

  return false;
};

const currentPassword = readRaw('input.txt');

console.log('Part 1:', part1(currentPassword));
console.log('Part 2:', part2(currentPassword));
