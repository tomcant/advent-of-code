type Instruction = [string, number];

export const parseInput = (input: string): Instruction[] =>
  input.split("\n").map((line) => {
    const [, dir, by] = line.match(/(.+)\s(\d+)/);
    return [dir, Number(by)];
  });

export const part1 = (dirs: Instruction[]): number => {
  let depth = 0;
  let pos = 0;

  for (const [dir, by] of dirs) {
    switch (dir) {
      case "forward":
        pos += by;
        break;
      case "down":
        depth += by;
        break;
      case "up":
        depth -= by;
        break;
    }
  }

  return depth * pos;
};

export const part2 = (dirs: Instruction[]): number => {
  let depth = 0;
  let pos = 0;
  let aim = 0;

  for (const [dir, by] of dirs) {
    switch (dir) {
      case "forward":
        pos += by;
        depth += by * aim;
        break;
      case "down":
        aim += by;
        break;
      case "up":
        aim -= by;
        break;
    }
  }

  return depth * pos;
};
