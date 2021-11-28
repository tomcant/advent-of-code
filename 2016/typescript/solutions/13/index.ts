import Queue from '../../utils/queue';
import Vec2d from '../../utils/vec2d';

type Node = {
  pos: Vec2d,
  steps: number
};

type State = {
  node: Node,
  history: Set<string>
};

export const parseInput = (input: string): number => Number(input);

export const part1 = (favNum: number): number => {
  for (const { node: { pos, steps } } of exploreMap(favNum)) {
    if (pos.x === 31 && pos.y === 39) {
      return steps;
    }
  }
};

export const part2 = (favNum: number): number => {
  for (const { node: { steps }, history } of exploreMap(favNum)) {
    if (steps === 50) {
      return history.size;
    }
  }
};

const exploreMap = function* (favNum: number): Generator<State> {
  const startPos = new Vec2d(1, 1);
  const history = new Set<string>([startPos.toString()]);
  const queue = new Queue<Node>([{ pos: startPos, steps: 0 }]);

  while (!queue.isEmpty()) {
    const node = queue.dequeue();

    yield { node, history };

    for (const neighbour of getNeighbouringPositions(node.pos, favNum)) {
      const hash = neighbour.toString();

      if (!history.has(hash)) {
        history.add(hash);

        queue.enqueue({
          pos: neighbour,
          steps: node.steps + 1
        });
      }
    }
  }
};

const getNeighbouringPositions = (pos: Vec2d, favNum: number): Vec2d[] => {
  const positions = [];

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 }
  ];

  for (const { dx, dy } of dirs) {
    const neighbour = pos.add(new Vec2d(dx, dy));

    if (neighbour.x >= 0 && neighbour.y >= 0 && !isWall(neighbour, favNum)) {
      positions.push(neighbour);
    }
  }

  return positions;
};

const isWall = ({ x, y }: Vec2d, favNum: number): boolean =>
  (countSetBits(x*x + 3*x + 2*x*y + y + y*y + favNum) & 1) === 1;

const countSetBits = (n: number): number => {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
};
