import Queue from '../../utils/queue';
import Vec2d from '../../utils/vec2d';

enum Tile {
  Wall = '#',
  Path = '.'
}

type Map = string[];

type State = {
  pos: Vec2d,
  visited: Set<string>
};

type Node = {
  state: State,
  steps: number
};

export const parseInput = (input: string): Map => input.split('\n');

export const part1 = (map: Map): number => {
  const startPos = getStartPos(map);
  const numTargets = getNumTargets(map);

  return findShortestPathToGoal(map, startPos, ({ visited }) => visited.size === numTargets);
};

export const part2 = (map: Map): number => {
  const startPos = getStartPos(map);
  const numTargets = getNumTargets(map);

  return findShortestPathToGoal(map, startPos, ({ pos, visited }) =>
    visited.size === numTargets && pos.x === startPos.x && pos.y === startPos.y);
};

const getStartPos = (map: Map): Vec2d => {
  for (let y = 0, x; y < map.length; ++y) {
    if ((x = map[y].indexOf('0')) !== -1) {
      return new Vec2d(x, y);
    }
  }
};

const getNumTargets = (map: Map): number => {
  let numTargets = 0;

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      numTargets += isTarget(new Vec2d(x, y), map) ? 1 : 0;
    }
  }

  return numTargets;
};

const findShortestPathToGoal = (map: Map, startPos: Vec2d, hasGoalBeenReached: (State) => boolean): number => {
  const initialState = { pos: startPos, visited: new Set<string>() };
  const history = new Set<string>([hashState(initialState)]);
  const queue = new Queue<Node>([{ state: initialState, steps: 0 }]);

  while (!queue.isEmpty()) {
    const { state, steps } = queue.dequeue();

    if (hasGoalBeenReached(state)) {
      return steps;
    }

    for (const neighbour of getNeighbouringPositions(state.pos, map)) {
      const visited = new Set<string>(state.visited);

      if (isTarget(neighbour, map)) {
        visited.add(getMapTile(neighbour, map));
      }

      const neighbourState = { pos: neighbour, visited };
      const hash = hashState(neighbourState);

      if (!history.has(hash)) {
        history.add(hash);
        queue.enqueue({ state: neighbourState, steps: steps + 1 });
      }
    }
  }
}

const getNeighbouringPositions = (pos: Vec2d, map: Map): Vec2d[] => {
  const positions = [];

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 }
  ];

  for (const { dx, dy } of dirs) {
    const neighbour = pos.add(new Vec2d(dx, dy));

    if (!isWall(neighbour, map)) {
      positions.push(neighbour);
    }
  }

  return positions;
};

const hashState = ({ pos, visited }: State): string => pos.toString() + [...visited].join('');
const isTarget = (pos: Vec2d, map: Map): boolean => !isPath(pos, map) && !isWall(pos, map) && +getMapTile(pos, map) > 0;
const isPath = (pos: Vec2d, map: Map): boolean => Tile.Path === getMapTile(pos, map);
const isWall = (pos: Vec2d, map: Map): boolean => Tile.Wall === getMapTile(pos, map);
const getMapTile = ({ x, y }: Vec2d, map: Map): Tile => map[y][x] as Tile;
