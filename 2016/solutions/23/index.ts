type Operator = 'cpy' | 'inc' | 'dec' | 'add' | 'mul' | 'jnz' | 'tgl' | 'nop';
type Instruction = { op: Operator, args?: string[] };
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

const run = (initialInstructions: Instruction[], initialRegisters: Registers): Registers => {
  const instructions = optimise(initialInstructions);
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
      case 'add':
        registers.set(args[0], registers.get(args[0]) + registers.get(args[1]));
        break;
      case 'mul':
        registers.set(args[0], registers.get(args[0]) * registers.get(args[1]));
        break;
      case 'nop':
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

/*
 * This performs a crude check for a pattern of instructions that can be optimised.
 *
 * Considering the instructions:
 *
 *   cpy b c
 *   inc a
 *   dec c
 *   jnz c -2
 *   dec d
 *   jnz d -5
 *
 * We can optimise this to `a += b * d` by adding two new opcodes:
 *
 *    - `add x y` adds y to the value of register x
 *    - `mul x y` multiplies the value of register x by y
 *
 * The resulting instructions become:
 *
 *   cpy b c
 *   mul c d
 *   add a c
 */
const optimise = (instructions: Instruction[]): Instruction[] => {
  const optimised = clone(instructions);

  for (let i = 5; i < instructions.length; ++i) {
    const { op, args } = instructions[i];

    if ('jnz' !== op || -5 !== +args[1]) {
      continue;
    }

    const cpy = instructions[i - 5];

    if ('cpy' !== cpy.op) {
      continue;
    }

    optimised[i - 4] = { op: 'mul', args: [cpy.args[1], args[0]] };
    optimised[i - 3] = { op: 'add', args: [instructions[i - 4].args[0], cpy.args[1]] };

    // Keep the original length of the instructions so as to not change any other behaviour.
    optimised[i] = optimised[i - 1] = optimised[i - 2] = { op: 'nop' };
  }

  return optimised;
};

const clone = (instructions: Instruction[]): Instruction[] =>
  instructions.map(({ op, args }) => ({ op, args: [...args] }));
