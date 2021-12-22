type Point = [number, number, number];
type Cuboid = [Point, Point];
type Toggle = "on" | "off";
type Instruction = [Toggle, Cuboid];

export const parseInput = (input: string): Instruction[] =>
  input.split("\n").map((line) => {
    const [, toggle, x1, x2, y1, y2, z1, z2] = line.match(
      /(on|off)\sx=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    );

    return [
      toggle as Toggle,
      [
        [+x1, +y1, +z1],
        [+x2, +y2, +z2],
      ],
    ];
  });

// prettier-ignore
export const part1 = (instructions: Instruction[]): number =>
  volume(
    processInstructions(
      instructions.filter(
        ([, [[x1, y1, z1], [x2, y2, z2]]]) =>
          x1 >= -50 && y1 >= -50 && z1 >= -50 && x2 <= 50 && y2 <= 50 && z2 <= 50
      )
    )
  );

export const part2 = (instructions: Instruction[]): number =>
  volume(processInstructions(instructions));

const volume = (cuboids: Cuboid[]): number =>
  cuboids.reduce(
    (sum, [[x1, y1, z1], [x2, y2, z2]]) =>
      sum + (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1),
    0
  );

const processInstructions = (instructions: Instruction[]): Cuboid[] => {
  let onCuboids = [];

  for (const [toggle, cuboid] of instructions) {
    onCuboids = onCuboids.flatMap((onCuboid) =>
      isOverlap(onCuboid, cuboid) ? splitOverlap(onCuboid, cuboid) : [onCuboid]
    );

    if (toggle === "on") {
      onCuboids.push(cuboid);
    }
  }

  return onCuboids;
};

const isOverlap = (cuboid: Cuboid, overlap: Cuboid): boolean => {
  const [[x1, y1, z1], [x2, y2, z2]] = cuboid;
  const [[ox1, oy1, oz1], [ox2, oy2, oz2]] = overlap;

  return (
    x1 <= ox2 && ox1 <= x2 && y1 <= oy2 && oy1 <= y2 && z1 <= oz2 && oz1 <= z2
  );
};

const splitOverlap = (cuboid: Cuboid, overlap: Cuboid): Cuboid[] => {
  const [[x1, y1, z1], [x2, y2, z2]] = cuboid;
  const [[ox1, oy1, oz1], [ox2, oy2, oz2]] = overlap;

  const cuboids = [];

  if (x1 <= ox1) {
    cuboids.push([
      [x1, y1, z1],
      [ox1 - 1, y2, z2],
    ]);
  }

  if (x2 >= ox2) {
    cuboids.push([
      [ox2 + 1, y1, z1],
      [x2, y2, z2],
    ]);
  }

  const x1mid = Math.max(x1, ox1);
  const x2mid = Math.min(x2, ox2);

  if (y1 <= oy1) {
    cuboids.push([
      [x1mid, y1, z1],
      [x2mid, oy1 - 1, z2],
    ]);
  }

  if (y2 >= oy2) {
    cuboids.push([
      [x1mid, oy2 + 1, z1],
      [x2mid, y2, z2],
    ]);
  }

  const y1mid = Math.max(y1, oy1);
  const y2mid = Math.min(y2, oy2);

  if (z1 <= oz1) {
    cuboids.push([
      [x1mid, y1mid, z1],
      [x2mid, y2mid, oz1 - 1],
    ]);
  }

  if (z2 >= oz2) {
    cuboids.push([
      [x1mid, y1mid, oz2 + 1],
      [x2mid, y2mid, z2],
    ]);
  }

  return cuboids;
};
