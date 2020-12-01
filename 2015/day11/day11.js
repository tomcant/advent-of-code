const { readRaw } = require('../../utils/file-io');

const letterA = 'a'.charCodeAt(0);

const toBase10 = base26 => [...base26].reduce(
  (base10, char, index) => base10 + 26 ** (base26.length - index - 1) * (char.charCodeAt(0) - letterA),
  0
);

const toBase26 = base10 => {
  let base26 = '';

  while (base10) {
    base26 = String.fromCharCode((base10 % 26) + letterA) + base26;
    base10 = Math.floor(base10 / 26);
  }

  return base26;
};

const incrementBase26 = base26 => toBase26(toBase10(base26) + 1);

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

const isPasswordValid = password =>
  !/iol/.test(password) &&
  /(.)\1.*(.)\2/.test(password) &&
  containsThreeConsecutiveChars(password);

const findNextValidPassword = password => {
  do password = incrementBase26(password);
  while (!isPasswordValid(password));

  return password;
};

const currentPassword = readRaw('input.txt');
const nextPassword = findNextValidPassword(currentPassword);
const nextNextPassword = findNextValidPassword(nextPassword);

console.log(nextPassword, nextNextPassword);
