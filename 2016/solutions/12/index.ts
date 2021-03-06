type Operator = 'cpy' | 'inc' | 'dec' | 'jnz';
type Instruction = { op: Operator, args: string[] };
type Registers = Map<string, number>;

const run = (instructions: Instruction[], initialRegisters: Registers): Registers => {
  const registers = initialRegisters;
  let nextIdx = 0;

  while (nextIdx < instructions.length) {
    const { op, args } = instructions[nextIdx];
    let idxIncrement = 1;

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
          idxIncrement = registers.get(args[1]) || +args[1];
        }
        break;
    }

    nextIdx += idxIncrement;
  }

  return registers;
};

export const part1 = (instructions: Instruction[]): number =>
  run(instructions, new Map<string, number>([['a', 0], ['b', 0], ['c', 0], ['d', 0]])).get('a');

export const part2 = (instructions: Instruction[]): number =>
  run(instructions, new Map<string, number>([['a', 0], ['b', 0], ['c', 1], ['d', 0]])).get('a');

export const parseInput = (input: string): Instruction[] =>
  input.split('\n').map(line => {
    const [, op, args] = line.match(/([^\s]+)\s(.+)/);
    return { op: op as Operator, args: args.split(' ') };
  });
