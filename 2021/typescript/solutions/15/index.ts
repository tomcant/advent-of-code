import PriorityQueue from "ts-priority-queue";
import Vec2d from "../../utils/vec2d";

type RiskMap = number[][];

type SearchNode = {
  pos: Vec2d;
  totalRisk: number;
};

export const parseInput = (input: string): RiskMap =>
  input.split("\n").map((line) => line.split("").map(Number));

export const part1 = (risks: RiskMap): number => {
  const coord = risks.length - 1;
  const target = new Vec2d(coord, coord);

  return findLowestTotalRisk(target, risks, 1);
};

export const part2 = (risks: RiskMap): number => {
  const coord = 5 * risks.length - 1;
  const target = new Vec2d(coord, coord);

  return findLowestTotalRisk(target, risks, 5);
};

const findLowestTotalRisk = (
  target: Vec2d,
  risks: RiskMap,
  factor: number
): number => {
  const queue = new PriorityQueue<SearchNode>({
    comparator: (a, b) => a.totalRisk - b.totalRisk,
    initialValues: [{ pos: new Vec2d(0, 0), totalRisk: 0 }],
  });
  const visited = new Set<string>();

  while (queue.length > 0) {
    const node = queue.dequeue();
    const hash = node.pos.toString();

    if (visited.has(hash)) {
      continue;
    }

    if (target.eq(node.pos)) {
      return node.totalRisk;
    }

    visited.add(hash);

    for (const adjPos of getAdjacentPositions(node.pos, risks, factor)) {
      queue.queue({
        pos: adjPos,
        totalRisk: node.totalRisk + scaleRisk(adjPos, risks, factor),
      });
    }
  }
};

const getAdjacentPositions = (
  pos: Vec2d,
  risks: RiskMap,
  factor: number
): Vec2d[] => {
  const adj = [];

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
  ];

  const size = factor * risks.length;

  for (const { dx, dy } of dirs) {
    const adjPos = pos.add(new Vec2d(dx, dy));

    if (adjPos.y >= 0 && adjPos.y < size && adjPos.x >= 0 && adjPos.x < size) {
      adj.push(adjPos);
    }
  }

  return adj;
};

const scaleRisk = (pos: Vec2d, risks: RiskMap, factor: number): number => {
  const size = risks.length;
  const origRisk = risks[pos.y % size][pos.x % size];

  if (factor === 1) {
    return origRisk;
  }

  const xOffset = Math.floor(pos.x / size);
  const yOffset = Math.floor(pos.y / size);

  return ((origRisk - 1 + xOffset + yOffset) % 9) + 1;
};
