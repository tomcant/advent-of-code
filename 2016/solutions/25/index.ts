type Operator = 'cpy' | 'inc' | 'dec' | 'jnz' | 'out';
type Instruction = { op: Operator, args: string[] };
type Registers = Map<string, number>;

export const parseInput = (input: string): Instruction[] =>
  input.split('\n').map(line => {
    const [, op, args] = line.match(/([^\s]+)\s(.+)/);
    return { op: op as Operator, args: args.split(' ') };
  });

export const part1 = (instructions: Instruction[]): number => {
  for (let a = 0; ; ++a) {
    const initialRegisters = new Map<string, number>(Object.entries({ a, b: 0, c: 0, d: 0 }));
    const historicalRegisters = [];
    let lastOutput = null;

    for (const { output, registers } of run(instructions, initialRegisters)) {
      if (lastOutput === null && output !== 0 || output === lastOutput) {
        break;
      }

      const hash = [...registers].join('');

      if (historicalRegisters.indexOf(hash) !== -1) {
        return a;
      }

      historicalRegisters.push(hash);
      lastOutput = output;
    }
  }
};

const run = function* (instructions: Instruction[], initialRegisters: Registers): Generator<{ output: number, registers: Registers }> {
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
      case 'out':
        yield {
          output: registers.get(args[0]),
          registers
        };
    }

    pointer += pointerInc;
  }

  return registers;
};

export const part2 = (instructions: Instruction[]): string => 'Nothing to see here...';
