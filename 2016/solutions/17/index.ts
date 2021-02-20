import { createHash } from 'crypto';
import Queue from '../../utils/queue';
import Vec2d from '../../utils/vec2d';

type Node = {
  pos: Vec2d,
  path: string
};

const WIDTH = 4;
const HEIGHT = 4;

const DIRS = {
  U: new Vec2d(0, -1),
  D: new Vec2d(0, 1),
  L: new Vec2d(-1, 0),
  R: new Vec2d(1, 0),
};

const findPathsToVault = function* (passcode: string): Generator<string> {
  const queue = new Queue<Node>([{ pos: new Vec2d(0, 0), path: '' }]);

  while (!queue.isEmpty()) {
    const node = queue.dequeue();

    if (isVaultPos(node.pos)) {
      yield node.path;
      continue;
    }

    queue.enqueue(...getPathOptions(node, passcode));
  }
};

const getPathOptions = ({ pos, path }: Node, passcode: string): Node[] => {
  const doors = createHash('md5').update(passcode + path).digest('hex');
  const nodes = [];
  let idx = 0;

  for (const [char, dir] of Object.entries(DIRS)) {
    if (isDoorOpen(doors[idx++])) {
      const nextPos = pos.add(dir);

      if (isWithinBounds(nextPos)) {
        nodes.push({ pos: nextPos, path: path + char });
      }
    }
  }

  return nodes;
};

const isDoorOpen = (door: string): boolean => door.charCodeAt(0) > 'a'.charCodeAt(0);
const isVaultPos = ({ x, y }: Vec2d): boolean => WIDTH - 1 === x && HEIGHT - 1 === y;
const isWithinBounds = ({ x, y }: Vec2d): boolean => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

export const part1 = (passcode: string): string => findPathsToVault(passcode).next().value;

export const part2 = (passcode: string): number => {
  let longest = 0;

  for (const path of findPathsToVault(passcode)) {
    if (path.length > longest) {
      longest = path.length;
    }
  }

  return longest;
};

export const parseInput = (input: string): string => input;
