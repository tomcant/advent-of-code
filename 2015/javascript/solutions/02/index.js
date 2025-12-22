const { readLines } = require('../../utils/file-io');

const part1 = presents => {
  let totalSurfaceArea = 0;

  for (const present of presents) {
    const [, length, width, height] = present.match(/(\d+)x(\d+)x(\d+)/);
    const surfaceAreas = [length * width, width * height, height * length];

    totalSurfaceArea += Math.min(...surfaceAreas) + 2 * surfaceAreas.reduce((sum, area) => sum + area, 0);
  }

  return totalSurfaceArea;
};

const part2 = presents => {
  let totalRibbonLength = 0;

  for (const present of presents) {
    const [, length, width, height] = present.match(/(\d+)x(\d+)x(\d+)/);
    const perimeter = 2 * Math.min(...[+length + +width, +width + +height, +height + +length]);

    totalRibbonLength += perimeter + length * width * height;
  }

  return totalRibbonLength;
};

const presents = readLines('input.txt');

console.log('Part 1:', part1(presents));
console.log('Part 2:', part2(presents));
