export const parseInput = (input: string): number[] =>
  input.split(",").map(Number);

export const part1 = (crabs: number[]): number =>
  findCheapest((dist) => dist, crabs);

export const part2 = (crabs: number[]): number =>
  findCheapest((dist) => (dist * (dist + 1)) / 2, crabs);

const findCheapest = (
  costFn: (_: number) => number,
  crabs: number[]
): number => {
  let cheapest = Infinity;

  for (let pos = 0; pos < Math.max(...crabs); ++pos) {
    const cost = crabs
      .map((crab) => costFn(Math.abs(crab - pos)))
      .reduce((sum, cost) => sum + cost, 0);

    if (cost < cheapest) {
      cheapest = cost;
    }
  }

  return cheapest;
};
