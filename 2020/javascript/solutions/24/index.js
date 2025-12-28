const { readLines } = require('../../utils/file-io');

// Thanks to this incredible resource: https://www.redblobgames.com/grids/hexagons

const directionDiffs = {
  e: [1, 0],
  w: [-1, 0],
  se: [0, 1],
  sw: [-1, 1],
  nw: [0, -1],
  ne: [1, -1]
};

const hash = (x, y) => `${x},${y}`;

const countBlackTiles = tiles => [...tiles].reduce(
  (count, [, isBlack]) => count + isBlack,
  0
);

const part1 = tiles => countBlackTiles(tiles);

const part2 = tiles => {
  let last = tiles;

  for (let i = 0; i < 100; ++i) {
    const [xMin, yMin, xMax, yMax] = [...last].reduce(
      ([xMin, yMin, xMax, yMax], [coord]) => {
        const [x, y] = coord.split(',');

        return [
          x < xMin ? +x : xMin,
          y < yMin ? +y : yMin,
          x > xMax ? +x : xMax,
          y > yMax ? +y : yMax
        ];
      },
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    const next = new Map();

    for (let x = xMin - 1; x <= xMax + 1; ++x) {
      for (let y = yMin - 1; y <= yMax + 1; ++y) {
        const count = Object.values(directionDiffs).reduce(
          (count, [dx, dy]) => count + !!last.get(hash(x + dx, y + dy)),
          0
        );

        next.set(hash(x, y), 2 === count || 1 === count && !!last.get(hash(x, y)));
      }
    }

    last = next;
  }

  return countBlackTiles(last);
};

const tiles = readLines('input.txt')
  .map(line => line.match(/(e|w|se|sw|nw|ne)/g))
  .map(directions => directions.map(dir => directionDiffs[dir]))
  .reduce(
    (tiles, directions) => {
      const [x, y] = directions.reduce(
        ([x, y], [dx, dy]) => [x + dx, y + dy],
        [0, 0]
      );

      return tiles.set(hash(x, y), !tiles.get(hash(x, y)));
    },
    new Map()
  );

console.log('Part 1:', part1(tiles));
console.log('Part 2:', part2(tiles));
