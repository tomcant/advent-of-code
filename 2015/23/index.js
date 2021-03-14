const { readLines } = require('../utils/file-io');

const part1 = instructions => run(instructions, { a: 0, b: 0 }).b;
const part2 = instructions => run(instructions, { a: 1, b: 0 }).b;

const run = (instructions, initialRegisters) => {
  let registers = initialRegisters;
  let next = 0;

  while (next < instructions.length) {
    const [op, args] = instructions[next];
    let increment = 1;

    switch (op) {
      case 'hlf':
        registers[args[0]] /= 2;
        break;
      case 'tpl':
        registers[args[0]] *= 3;
        break;
      case 'inc':
        registers[args[0]] += 1;
        break;
      case 'jmp':
        increment = +args[0];
        break;
      case 'jie':
        if (registers[args[0]] % 2 === 0) {
          increment = +args[1];
        }
        break;
      case 'jio':
        if (registers[args[0]] === 1) {
          increment = +args[1];
        }
        break;
    }

    next += increment;
  }

  return registers;
};

const instructions = readLines('input.txt').map(line => {
  const [, op, args] = line.match(/([^\s]+)\s(.+)/);
  return [op, args.split(', ')];
});

console.log('Part 1:', part1(instructions));
console.log('Part 2:', part2(instructions));
