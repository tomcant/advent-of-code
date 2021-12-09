import Vec2d from "../../utils/vec2d";

type Line = [Vec2d, Vec2d];
type Grid = Map<string, number>;

export const parseInput = (input: string): Line[] =>
  input.split("\n").map(
    (line) =>
      line.split(" -> ").map((point) => {
        const parts = point.split(",");
        return new Vec2d(+parts[0], +parts[1]);
      }) as Line
  );

export const part1 = (lines: Line[]): number =>
  countOverlaps(
    drawLines(lines.filter(([from, to]) => from.x === to.x || from.y === to.y))
  );

export const part2 = (lines: Line[]): number => countOverlaps(drawLines(lines));

const drawLines = (lines: Line[]): Grid => {
  const grid = new Map();

  const addPoint = (pos: Vec2d) => {
    const hash = pos.toString();
    grid.set(hash, grid.get(hash) + 1 || 1);
  };

  for (const [from, to] of lines) {
    const dir = getDir(from, to);
    let pos = from;
    addPoint(pos);

    do {
      pos = pos.add(dir);
      addPoint(pos);
    } while (!pos.eq(to));
  }

  return grid;
};

const getDir = (from: Vec2d, to: Vec2d): Vec2d => {
  if (from.x === to.x) {
    return from.y < to.y ? new Vec2d(0, 1) : new Vec2d(0, -1);
  }

  if (from.y === to.y) {
    return from.x < to.x ? new Vec2d(1, 0) : new Vec2d(-1, 0);
  }

  if (from.x < to.x) {
    return from.y < to.y ? new Vec2d(1, 1) : new Vec2d(1, -1);
  }

  return from.y < to.y ? new Vec2d(-1, 1) : new Vec2d(-1, -1);
};

const countOverlaps = (grid: Grid): number =>
  [...grid].reduce((sum, [_, v]) => sum + (v > 1 ? 1 : 0), 0);
