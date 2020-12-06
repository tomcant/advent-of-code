const { readGroupsRaw } = require('../../utils/file-io');

const containsFields = (passport, fields) => fields.reduce(
  (containsFields, field) => containsFields && field in passport,
  true
);

const isBetween = (number, min, max) => number >= min && number <= max;

const countValidPassports = (passports, validators) => passports.reduce(
  (count, passport) => count + validators.reduce((isValid, validator) => isValid && validator(passport), true),
  0
);

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const part1 = passports => countValidPassports(passports, [
  passport => containsFields(passport, requiredFields)
]);

const part2 = passports => countValidPassports(passports, [
  passport => containsFields(passport, requiredFields),
  ({ byr: birthYear }) => isBetween(birthYear, 1920, 2002),
  ({ iyr: issueYear }) => isBetween(issueYear, 2010, 2020),
  ({ eyr: expireYear }) => isBetween(expireYear, 2020, 2030),
  ({ hcl: hairColour }) => /^#[\da-f]{6}$/.test(hairColour),
  ({ ecl: eyeColour }) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(eyeColour),
  ({ pid: passportId }) => /^\d{9}$/.test(passportId),
  ({ hgt: height }) => {
    const match = height.match(/^(\d+)(cm|in)$/);

    if (!match) {
      return false;
    }

    const [, value, unit] = match;

    return (unit === 'cm' && isBetween(value, 150, 193))
      || (unit === 'in' && isBetween(value, 59, 76));
  }
]);

const passports = [];

readGroupsRaw('input.txt').forEach(
  passport => void passports.push(
    passport
      .match(/([^\s]+):([^\s]+)/g)
      .map(keyValue => keyValue.split(':'))
      .reduce((passport, [key, value]) => Object.assign(passport, { [key]: value }), {})
  )
);

console.log(part1(passports), part2(passports));
