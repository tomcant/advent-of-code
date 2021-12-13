type Point = [number, number];
type Fold = ["x" | "y", number];

export const parseInput = (input: string): [Point[], Fold[]] => {
  const [pointsRaw, foldsRaw] = input.split("\n\n");

  const points = pointsRaw
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);

  const folds = foldsRaw.split("\n").map((line) => {
    const [, axis, val] = line.match(/([xy])=(\d+)/);
    return [axis, Number(val)] as Fold;
  });

  return [points, folds];
};

export const part1 = ([points, folds]: [Point[], Fold[]]): number =>
  new Set(fold(points, folds[0]).map(([x, y]) => `${x},${y}`)).size;

export const part2 = ([points, folds]: [Point[], Fold[]]): string =>
  "\n" + draw(folds.reduce((points, f) => fold(points, f), points));

const fold = (points: Point[], [axis, val]: Fold): Point[] =>
  points.map(([x, y]) => {
    if (axis === "y" && y > val) {
      return [x, 2 * val - y];
    }
    if (axis === "x" && x > val) {
      return [2 * val - x, y];
    }
    return [x, y];
  });

const draw = (points: Point[]): string => {
  let [maxX, maxY] = [0, 0];
  const strPoints = [];

  for (const [x, y] of points) {
    strPoints.push(`${x},${y}`);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const lines = [];

  for (let y = 0; y <= maxY; ++y) {
    let line = "";
    for (let x = 0; x <= maxX; ++x) {
      line += strPoints.includes(`${x},${y}`) ? "#" : ".";
    }
    lines.push(line);
  }

  return lines.join("\n");
};
