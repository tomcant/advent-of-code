type Pixel = boolean;
type Image = Map<string, Pixel>;
type Point = [number, number];

// prettier-ignore
const DIR_DIFFS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0], [0,  0], [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export const parseInput = (input: string): [Pixel[], Image] => {
  const [algo, pixels] = input.split("\n\n");
  const imageRows = pixels.split("\n");
  const image = new Map();

  for (let y = 0; y < imageRows.length; ++y) {
    for (let x = 0; x < imageRows[y].length; ++x) {
      image.set(hash(x, y), imageRows[y][x] === "#");
    }
  }

  return [[...algo].map((p) => p === "#"), image];
};

export const part1 = ([algo, image]: [Pixel[], Image]): number => {
  for (let step = 1; step <= 2; ++step) {
    image = enhance(algo, image, algo[0] && step % 2 < 1);
  }

  return countLitPixels(image);
};

export const part2 = ([algo, image]: [Pixel[], Image]): number => {
  for (let step = 1; step <= 50; ++step) {
    image = enhance(algo, image, algo[0] && step % 2 < 1);
  }

  return countLitPixels(image);
};

const enhance = (
  algo: Pixel[],
  image: Image,
  areOutOfBoundsPixelsLit: boolean
): Image => {
  const enhanced = new Map();
  const [[xMin, yMin], [xMax, yMax]] = bounds(image);

  for (let y = yMin - 1; y <= yMax + 1; ++y) {
    for (let x = xMin - 1; x <= xMax + 1; ++x) {
      const index = DIR_DIFFS.reduce((index, [dx, dy], idx) => {
        const isLit = image.get(hash(x + dx, y + dy));

        if (isLit || (isLit === undefined && areOutOfBoundsPixelsLit)) {
          return index | (1 << (8 - idx));
        }

        return index;
      }, 0);

      enhanced.set(hash(x, y), algo[index]);
    }
  }

  return enhanced;
};

const bounds = (image: Image): [Point, Point] => {
  const pixels = [...image.keys()].map(unhash);
  const xs = [...pixels].map(([x]) => x);
  const ys = [...pixels].map(([, y]) => y);

  return [
    [Math.min(...xs), Math.min(...ys)],
    [Math.max(...xs), Math.max(...ys)],
  ];
};

const countLitPixels = (image: Image): number =>
  [...image.values()].filter(Boolean).length;

const hash = (x: number, y: number): string => `${x},${y}`;
const unhash = (hash: string): Point => hash.split(",").map(Number) as Point;
