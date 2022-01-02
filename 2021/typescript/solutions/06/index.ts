export const parseInput = (input: string): number[] =>
  input.split(",").map(Number);

export const part1 = (ages: number[]): number => simulate(ages, 80);
export const part2 = (ages: number[]): number => simulate(ages, 256);

const simulate = (ages: number[], days: number): number => {
  const fish = Array(9).fill(0);

  for (const age of ages) {
    fish[age] += 1;
  }

  while (days--) {
    fish[7] += fish[0];
    fish.push(fish.shift());
  }

  return fish.reduce((sum, f) => sum + f);
};
