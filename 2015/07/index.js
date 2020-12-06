const { readLines } = require('../../utils/file-io');

const resolvers = {
  '^\\d+$': ([number]) => number,

  '^\\D+$': ([wire], wires) => wires[wire] || null,

  'NOT (.+)': ([, wire], wires) => undefined !== wires[wire] ? (2 << 15) + ~wires[wire] : null,

  '(\\d+) AND (\\D+)': ([, lhs, rhs], wires) => undefined !== wires[rhs] ? lhs & wires[rhs] : null,

  '(\\D+) (AND|OR) (\\D+)': ([, lhs, op, rhs], wires) =>
    undefined === wires[lhs] || undefined === wires[rhs] ? null :
      'AND' === op ? wires[lhs] & wires[rhs] : wires[lhs] | wires[rhs],

  '(.+) (LSHIFT|RSHIFT) (.+)': ([, lhs, op, rhs], wires) =>
    undefined === wires[lhs] ? null : 'LSHIFT' === op ? wires[lhs] << rhs : wires[lhs] >> rhs
};

const resolve = instructions => {
  const wires = {};

  while (instructions.length) {
    for (const index in instructions) {
      const [operation, wire] = instructions[index].split('->').map(str => str.trim());

      for (const [regex, resolver] of Object.entries(resolvers)) {
        const matches = operation.match(regex);

        if (matches) {
          let resolution = resolver(matches, wires);

          if (null !== resolution) {
            wires[wire] = resolution;
            instructions.splice(index, 1);
            break;
          }
        }
      }
    }
  }

  return wires;
};

const instructions = readLines('input.txt');
const part1resolved = resolve(instructions.slice());

console.log(part1resolved['a']);

for (const index in instructions) {
  if (instructions[index].match(/-> b$/)) {
    instructions[index] = part1resolved['a'] + ' -> b';
    break;
  }
}

const part2resolved = resolve(instructions.slice());
console.log(part2resolved['a']);
