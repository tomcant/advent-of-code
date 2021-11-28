export const parseInput = (input: string): number => Number(input);

export const part1 = (numElfs: number): number => {
  // See https://en.wikipedia.org/wiki/Josephus_problem
  let msb = 1;
  while (numElfs > msb) msb *= 2;
  return ~msb & numElfs * 2 + 1;
};

export const part2 = (numElfs: number): number => {
  let simulatedNumElfs = 1;
  let winningElf = 1;
  let step;

  while (simulatedNumElfs < numElfs) {
    if (simulatedNumElfs === 2 * winningElf) {
      step = 2;
    } else if (simulatedNumElfs === winningElf) {
      step = 1;
      winningElf = 0;
    }

    winningElf += step;
    simulatedNumElfs += 1;
  }

  return winningElf;
};
