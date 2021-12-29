type Operator = "inp" | "add" | "mul" | "div" | "mod" | "eql";
type Instruction = { op: Operator; args: string[] };

const Z_UPPER_CUT_OFF = 26 ** 5;

export const parseInput = (input: string): Instruction[] =>
  input.split("\n").map((line) => {
    const [, op, args] = line.match(/([^\s]+)\s(.+)/);
    return { op: op as Operator, args: args.split(" ") };
  });

export const part1 = (instructions: Instruction[]): string =>
  findModelNumber(instructions, [9, 8, 7, 6, 5, 4, 3, 2, 1]);

export const part2 = (instructions: Instruction[]): string =>
  findModelNumber(instructions, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

const findModelNumber = (
  instructions: Instruction[],
  digits: number[]
): string | null => {
  const cache = new Map();

  const search = (ptr, { w, x, y, z }) => {
    if (z > Z_UPPER_CUT_OFF) {
      return null;
    }

    if (ptr === instructions.length) {
      return z === 0 ? "" : null;
    }

    const hash = `${ptr},${w},${x},${y},${z}`;

    if (cache.has(hash)) {
      return cache.get(hash);
    }

    const registers = { w, x, y, z };
    const { op, args } = instructions[ptr];

    if (op === "inp") {
      for (const digit of digits) {
        const nextRegisters = { ...registers, [args[0]]: digit };
        const modelNumber = search(ptr + 1, nextRegisters);

        if (modelNumber !== null) {
          return `${digit}${modelNumber}`;
        }
      }

      return null;
    }

    const val = registers[args[1]] ?? Number(args[1]);

    switch (op) {
      case "add":
        registers[args[0]] += val;
        break;
      case "mul":
        registers[args[0]] *= val;
        break;
      case "div":
        registers[args[0]] = Math.floor(registers[args[0]] / val);
        break;
      case "mod":
        registers[args[0]] %= val;
        break;
      case "eql":
        registers[args[0]] = registers[args[0]] === val ? 1 : 0;
        break;
    }

    cache.set(hash, search(ptr + 1, registers));

    return cache.get(hash);
  };

  return search(0, { w: 0, x: 0, y: 0, z: 0 });
};
