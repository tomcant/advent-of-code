type Triangle = [number, number, number];

export const parseInput = (input: string): Triangle[] =>
  input.split("\n").map((line) => {
    const [l1, l2, l3] = line.trim().split(/\s+/);
    return [+l1, +l2, +l3] as Triangle;
  });

export const part1 = (triangles: Triangle[]): number =>
  triangles.reduce(
    (validCount, triangle) => validCount + +isValid(triangle),
    0
  );

export const part2 = (triangles: Triangle[]): number => {
  let validCount = 0;

  for (let i = 0; i < triangles.length; i += 3) {
    for (let j = 0; j < 3; ++j) {
      validCount += +isValid([
        triangles[i][j],
        triangles[i + 1][j],
        triangles[i + 2][j],
      ]);
    }
  }

  return validCount;
};

const isValid = ([l1, l2, l3]: Triangle): boolean =>
  l1 + l2 > l3 && l1 + l3 > l2 && l2 + l3 > l1;
