const WIDTH = 10;

export const parseInput = (input: string): number[] =>
  input
    .split("\n")
    .reduce((acc, row) => [...acc, ...row.split("")], [])
    .map(Number);

export const part1 = (levels: number[]): number => {
  let flashes = 0;

  for (let steps = 0; steps < 100; ++steps) {
    flashes += energise(levels).filter((l) => l === 0).length;
  }

  return flashes;
};

export const part2 = (levels: number[]): number => {
  for (let steps = 1; ; ++steps) {
    if (energise(levels).every((l) => l === 0)) {
      return steps;
    }
  }
};

const energise = (levels: number[]): number[] => {
  levels.forEach((_, idx) => (levels[idx] += 1));

  while (levels.some((l) => l > 9)) {
    for (let idx = 0; idx < levels.length; ++idx) {
      if (levels[idx] <= 9) {
        continue;
      }

      levels[idx] = 0;

      for (const adjIdx of getAdjacentIndices(idx)) {
        if (levels[adjIdx] > 0) {
          levels[adjIdx] += 1;
        }
      }
    }
  }

  return levels;
};

const getAdjacentIndices = (idx: number): number[] => {
  const adj = [];
  const x = idx % WIDTH;
  const y = Math.floor(idx / WIDTH);

  if (y > 0) {
    adj.push({ x, y: y - 1 });
    if (x > 0) adj.push({ x: x - 1, y: y - 1 });
    if (x < WIDTH - 1) adj.push({ x: x + 1, y: y - 1 });
  }

  if (y < WIDTH - 1) {
    adj.push({ x, y: y + 1 });
    if (x > 0) adj.push({ x: x - 1, y: y + 1 });
    if (x < WIDTH - 1) adj.push({ x: x + 1, y: y + 1 });
  }

  if (x > 0) adj.push({ x: x - 1, y });
  if (x < WIDTH - 1) adj.push({ x: x + 1, y });

  return adj.map(({ x, y }) => y * WIDTH + x);
};
