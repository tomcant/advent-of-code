type Grid = {
  cells: Map<string, ">" | "v">;
  width: number;
  height: number;
};

export const parseInput = (input: string): Grid => {
  const cells = new Map();
  const lines = input.split("\n");
  const width = lines[0].length;
  const height = lines.length;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (lines[y][x] !== ".") {
        cells.set(`${x},${y}`, lines[y][x]);
      }
    }
  }

  return {
    cells,
    width,
    height,
  };
};

export const part1 = (grid: Grid): number => {
  let steps = 0;
  let changed;
  let last = grid;

  do {
    steps += 1;
    [changed, last] = step(last);
  } while (changed);

  return steps;
};

const step = (grid: Grid): [boolean, Grid] => {
  let changed = false;
  const cells = new Map([...grid.cells]);

  for (const [key, val] of grid.cells) {
    if (val === ">") {
      const [, x, y] = key.match(/(\d+),(\d+)/);
      const hashNext = `${(+x + 1) % grid.width},${y}`;

      if (!grid.cells.has(hashNext)) {
        cells.set(hashNext, ">");
        cells.delete(`${x},${y}`);
        changed = true;
      }
    }
  }

  for (const [key, val] of grid.cells) {
    if (val === "v") {
      const [, x, y] = key.match(/(\d+),(\d+)/);
      const hashNext = `${x},${(+y + 1) % grid.height}`;

      if (!cells.has(hashNext) && grid.cells.get(hashNext) !== "v") {
        cells.set(hashNext, "v");
        cells.delete(`${x},${y}`);
        changed = true;
      }
    }
  }

  return [changed, { ...grid, cells }];
};

export const part2 = (grid: Grid): string => "Nothing to see here...";
