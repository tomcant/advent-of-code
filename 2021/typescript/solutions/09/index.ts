import Queue from "../../utils/queue";
import Vec2d from "../../utils/vec2d";

type HeightMap = number[][];

export const parseInput = (input: string): HeightMap =>
  input.split("\n").map((line) => line.split("").map(Number));

export const part1 = (map: HeightMap): number => {
  let sum = 0;

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (isLowPoint(map, new Vec2d(x, y))) {
        sum += map[y][x] + 1;
      }
    }
  }

  return sum;
};

export const part2 = (map: HeightMap): number => {
  const basinSizes = [];

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const pos = new Vec2d(x, y);

      if (isLowPoint(map, pos)) {
        basinSizes.push(findBasinSize(map, pos));
      }
    }
  }

  return basinSizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, size) => acc * size, 1);
};

const isLowPoint = (map: HeightMap, pos: Vec2d): boolean =>
  getAdjacentPositions(map, new Vec2d(pos.x, pos.y)).every(
    (adjPos) => map[pos.y][pos.x] < map[adjPos.y][adjPos.x]
  );

const getAdjacentPositions = (map: HeightMap, pos: Vec2d): Vec2d[] => {
  const adj = [];

  if (pos.y > 0) adj.push(new Vec2d(pos.x, pos.y - 1));
  if (pos.x > 0) adj.push(new Vec2d(pos.x - 1, pos.y));
  if (pos.y < map.length - 1) adj.push(new Vec2d(pos.x, pos.y + 1));
  if (pos.x < map[pos.y].length - 1) adj.push(new Vec2d(pos.x + 1, pos.y));

  return adj;
};

const findBasinSize = (map: HeightMap, pos: Vec2d): number => {
  const basin = new Set<string>();
  const queue = new Queue<Vec2d>([pos]);

  while (!queue.isEmpty()) {
    const pos = queue.dequeue();
    const hash = pos.toString();

    if (basin.has(hash) || map[pos.y][pos.x] === 9) {
      continue;
    }

    basin.add(hash);

    for (const adjPos of getAdjacentPositions(map, pos)) {
      queue.enqueue(adjPos);
    }
  }

  return basin.size;
};
