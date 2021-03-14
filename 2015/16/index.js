const { readLines } = require('../utils/file-io');

const part1 = (aunts, readings) => findMatchingAunt(aunts, readings);

const part2 = (aunts, readings) =>
  findMatchingAunt(aunts, readings, {
    cats: (x, y) => x < y,
    trees: (x, y) => x < y,
    pomeranians: (x, y) => x > y,
    goldfish: (x, y) => x > y
  });

const findMatchingAunt = (aunts, readings, validators) =>
  Object.entries(aunts).reduce(
    (matchingIndex, [index, attributes]) => matchingIndex ??
      (matches(readings, attributes, validators) ? +index + 1 : null),
    null
  );

const matches = (readings, attributes, validators = {}) => {
  for (const [attribute, value] of Object.entries(attributes)) {
    const validator = validators[attribute] || ((x, y) => x === y);

    if (!validator(readings[attribute], value)) {
      return false;
    }
  }

  return true;
};

const aunts = readLines('input.txt').map(line => {
  const [, attributes] = line.match(/\w+:\s(.+)/);

  return Object.fromEntries(
    attributes.split(',')
      .map(attribute => attribute.trim().split(':'))
      .map(([name, value]) => [name, +value])
  );
});

const readings = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

console.log('Part 1:', part1(aunts, readings));
console.log('Part 2:', part2(aunts, readings));
