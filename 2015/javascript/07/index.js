const { Queue } = require('../utils/queue');
const { readLines } = require('../utils/file-io');

const part1 = instructions => resolve(instructions)['a'];

const part2 = instructions => {
  const p1a = part1(instructions);

  for (let i = 0; i < instructions.length; ++i) {
    if (instructions[i].match(/-> b$/)) {
      instructions[i] = `${p1a} -> b`;
      break;
    }
  }

  return resolve(instructions)['a'];
};

const resolvers = {
  '^\\d+$': ([number]) => number,

  '^\\D+$': ([wire], wires) => wires[wire] || null,

  'NOT (.+)': ([, wire], wires) => undefined !== wires[wire] ? (1 << 16) + ~wires[wire] : null,

  '(\\d+) AND (\\D+)': ([, lhs, rhs], wires) => undefined !== wires[rhs] ? lhs & wires[rhs] : null,

  '(\\D+) (AND|OR) (\\D+)': ([, lhs, op, rhs], wires) =>
    undefined === wires[lhs] || undefined === wires[rhs] ? null :
      'AND' === op ? wires[lhs] & wires[rhs] : wires[lhs] | wires[rhs],

  '(.+) (LSHIFT|RSHIFT) (.+)': ([, lhs, op, rhs], wires) =>
    undefined === wires[lhs] ? null : 'LSHIFT' === op ? wires[lhs] << rhs : wires[lhs] >> rhs
};

const resolve = instructions => {
  const queue = new Queue([...instructions]);
  const wires = {};

  while (!queue.isEmpty()) {
    const instruction = queue.dequeue();
    const [operation, wire] = instruction.split('->').map(str => str.trim());

    for (const [regex, resolver] of Object.entries(resolvers)) {
      const matches = operation.match(regex);

      if (matches) {
        let resolution = resolver(matches, wires);

        if (null !== resolution) {
          wires[wire] = resolution;
          break;
        }
      }
    }

    if (wires[wire] === undefined) {
      queue.enqueue(instruction);
    }
  }

  return wires;
};

const instructions = readLines('input.txt');

console.log('Part 1:', part1(instructions));
console.log('Part 2:', part2(instructions));
