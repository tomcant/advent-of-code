import Vec2d from '../../utils/vec2d';

enum Direction {
  Left = 'L',
  Right = 'R'
}

type Instruction = [Direction, number];

const rotateVec = (v: Vec2d, dir: Direction): Vec2d =>
  dir === Direction.Left ? new Vec2d(-v.y, v.x) : new Vec2d(v.y, -v.x);

const manhattanDistance = (v: Vec2d): number => Math.abs(v.x) + Math.abs(v.y);

export const part1 = (instructions: Instruction[]): number => {
  let pos: Vec2d = new Vec2d(0, 0);
  let dir: Vec2d = new Vec2d(0, 1);

  for (const [rotDir, dist] of instructions) {
    dir = rotateVec(dir, rotDir);
    pos = pos.add(new Vec2d(dir.x * dist, dir.y * dist));
  }

  return manhattanDistance(pos);
};

export const part2 = (instructions: Instruction[]): number => {
  let pos: Vec2d = new Vec2d(0, 0);
  let dir: Vec2d = new Vec2d(0, 1);

  const seen = new Set<string>();

  for (const [rotDir, dist] of instructions) {
    dir = rotateVec(dir, rotDir);

    for (let i = 0; i < dist; ++i) {
      pos = pos.add(dir);

      if (seen.has(pos.toString())) {
        return manhattanDistance(pos);
      }

      seen.add(pos.toString());
    }
  }

  return null;
};

export const parseInput = (input: string): Instruction[] =>
  input.split(', ').map(instruction => {
    const [dir, dist] = [instruction[0], instruction.substr(1)];

    if (dir !== Direction.Left && dir !== Direction.Right) {
      throw new Error(`Invalid instruction: ${instruction}`);
    }

    return [dir, +dist];
  });
