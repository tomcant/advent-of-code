type IpRange = [number, number];

export const part1 = (ranges: IpRange[]): number => {
  let max = 0;

  for (const [from, to] of ranges.sort(([a], [b]) => a - b)) {
    if (from - max > 1) {
      return max + 1;
    }

    if (to > max) {
      max = to;
    }
  }
};

export const part2 = (ranges: IpRange[]): number => {
  let max = 0;
  let count = 0;

  for (const [from, to] of ranges.sort(([a], [b]) => a - b)) {
    if (from - max > 1) {
      count += from - max - 1;
    }

    if (to > max) {
      max = to;
    }
  }

  return count;
};

export const parseInput = (input: string): IpRange[] =>
  input.split('\n').map(line => {
    const [, from, to] = line.match(/(\d+)-(\d+)/);
    return [+from, +to];
  });
