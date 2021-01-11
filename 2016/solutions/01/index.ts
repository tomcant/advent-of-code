enum Direction {
  Left = 'L',
  Right = 'R'
}

type Instruction = [Direction, number];

class Vec2d {
  constructor(readonly x: number, readonly y: number) {}

  public add(v: Vec2d): Vec2d {
    return new Vec2d(this.x + v.x, this.y + v.y);
  }

  public rotate(dir: Direction): Vec2d {
    return dir === Direction.Left
      ? new Vec2d(-this.y, this.x)
      : new Vec2d(this.y, -this.x);
  }

  public manhattanDistance(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`
  }
}

export const part1 = (instructions: Instruction[]): number => {
  let pos: Vec2d = new Vec2d(0, 0);
  let dir: Vec2d = new Vec2d(0, 1);

  for (const [rotDir, dist] of instructions) {
    dir = dir.rotate(rotDir);
    pos = pos.add(new Vec2d(dir.x * dist, dir.y * dist));
  }

  return pos.manhattanDistance();
};

export const part2 = (instructions: Instruction[]): number => {
  let pos: Vec2d = new Vec2d(0, 0);
  let dir: Vec2d = new Vec2d(0, 1);

  const seen = new Set<string>();

  for (const [rotDir, dist] of instructions) {
    dir = dir.rotate(rotDir);

    for (let i = 0; i < dist; ++i) {
      pos = pos.add(dir);

      if (seen.has(pos.toString())) {
        return pos.manhattanDistance();
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
