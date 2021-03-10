type Operator = 'cpy' | 'inc' | 'dec' | 'jnz' | 'tgl';
type Instruction = { op: Operator, args: string[] };
type Registers = Map<string, number>;

export const parseInput = (input: string): Instruction[] =>
  input.split('\n').map(line => {
    const [, op, args] = line.match(/([^\s]+)\s(.+)/);
    return { op: op as Operator, args: args.split(' ') };
  });

export const part1 = (instructions: Instruction[]): number =>
  run(instructions, new Map<string, number>([['a', 7], ['b', 0], ['c', 0], ['d', 0]])).get('a');

export const part2 = (instructions: Instruction[]): number =>
  run(instructions, new Map<string, number>([['a', 12], ['b', 0], ['c', 0], ['d', 0]])).get('a');

const run = (instructions: Instruction[], initialRegisters: Registers): Registers => {
  const registers = initialRegisters;
  let pointer = 0;

  while (pointer < instructions.length) {
    const { op, args } = instructions[pointer];
    let pointerInc = 1;

    switch (op) {
      case 'cpy':
        registers.set(args[1], registers.has(args[0]) ? registers.get(args[0]) : +args[0]);
        break;
      case 'inc':
        registers.set(args[0], registers.get(args[0]) + 1);
        break;
      case 'dec':
        registers.set(args[0], registers.get(args[0]) - 1);
        break;
      case 'jnz':
        if (registers.get(args[0]) || +args[0]) {
          pointerInc = registers.get(args[1]) || +args[1];
        }
        break;
      case 'tgl':
        const toggleIdx = pointer + registers.get(args[0]);

        if (toggleIdx < instructions.length) {
          const instruction = instructions[toggleIdx];
          instruction.op = instruction.args.length === 1
            ? instruction.op === 'inc' ? 'dec' : 'inc'
            : instruction.op === 'jnz' ? 'cpy' : 'jnz';
        }
    }

    pointer += pointerInc;
  }

  return registers;
};
