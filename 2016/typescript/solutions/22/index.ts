import Queue from '../../utils/queue';
import Vec2d from '../../utils/vec2d';

type StorageNode = {
  pos: Vec2d,
  size: number,
  used: number
};

type StorageCluster = StorageNode[];

export const parseInput = (input: string): StorageCluster =>
  input.split('\n').slice(2).map(line => {
    const [, x, y, size, used] = line.match(/x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T/);
    return { pos: new Vec2d(+x, +y), size: +size, used: +used };
  });

export const part1 = (cluster: StorageCluster): number => {
  let count = 0;

  for (const { pos: { x: xA, y: yA }, used: usedA } of cluster) {
    for (const { pos: { x: xB, y: yB }, size: sizeB, used: usedB } of cluster) {
      count += Number((xA !== xB || yA !== yB) && usedA > 0 && usedA <= sizeB - usedB);
    }
  }

  return count;
};

/*
 * Part 2...
 *
 *   Step 1: find the shortest path from the empty node (▢) to the space next to (G)
 *                                                       │
 *   Step 2: use the empty node to move (G) to (.); it   │
 *           takes 5 steps to move one space closer      │
 *     │                                                 │
 *     ↓      5     4     3     2     1                  │
 *    (.)... ▢G│ ← │G│ ← │G│ ← │G│ ← │G▢ ← ▢G ←──────────╯
 *     ..... ╰─╯   ▢─╯   ╰▢╯   ╰─▢   ╰─╯ ..│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     ....................................│.
 *     .....╭──────────────────────────────╯.
 *     .....│################################ ⟵ "very large, very full" nodes (a wall)
 *     .....╰──────────╮.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ................│.....................
 *     ...............(▢)....................
 */
export const part2 = (cluster: StorageCluster): number => {
  const gridMin = new Vec2d(0, 0);
  const gridWidth = getClusterWidth(cluster);
  const gridHeight = getClusterHeight(cluster);
  const gridMax = new Vec2d(gridWidth - 1, gridHeight - 1);

  const dataNodePos = new Vec2d(gridWidth - 1, 0);
  const adjDataNodePos = dataNodePos.add(new Vec2d(-1, 0));
  const emptyNode = cluster.find(({ used }) => 0 === used);

  const history = new Set<string>([emptyNode.pos.toString()]);
  const queue = new Queue([{ emptyPos: emptyNode.pos, steps: 0 }]);

  while (!queue.isEmpty()) {
    const searchNode = queue.dequeue();

    if (searchNode.emptyPos.x === adjDataNodePos.x && searchNode.emptyPos.y === adjDataNodePos.y) {
      return searchNode.steps + calcStepsFromDataNodeToAccessibleNode(adjDataNodePos);
    }

    for (const neighbour of getNeighbourPositions(searchNode.emptyPos, gridMin, gridMax)) {
      if (emptyNode.size < getNodeAt(neighbour, cluster).used) {
        continue;
      }

      const hash = neighbour.toString();

      if (!history.has(hash)) {
        history.add(hash);

        queue.enqueue({
          emptyPos: neighbour,
          steps: searchNode.steps + 1
        });
      }
    }
  }
};

const getNeighbourPositions = (pos: Vec2d, gridMin: Vec2d, gridMax: Vec2d): Vec2d[] => {
  const positions = [];

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 }
  ];

  for (const { dx, dy } of dirs) {
    const neighbour = pos.add(new Vec2d(dx, dy));

    if (neighbour.x < gridMin.x || neighbour.y < gridMin.y) {
      continue;
    }

    if (neighbour.x > gridMax.x || neighbour.y > gridMax.y) {
      continue;
    }

    positions.push(neighbour);
  }

  return positions;
};

const getNodeAt = ({ x, y }: Vec2d, cluster: StorageCluster): StorageNode => cluster[x * (getClusterHeight(cluster)) + y];
const getClusterWidth = (cluster: StorageCluster): number => cluster[cluster.length - 1].pos.x + 1;
const getClusterHeight = (cluster: StorageCluster): number => cluster[cluster.length - 1].pos.y + 1;
const calcStepsFromDataNodeToAccessibleNode = (pos: Vec2d): number => pos.x * 5 + 1;
