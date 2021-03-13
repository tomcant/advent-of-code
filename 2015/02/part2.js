const { readLines } = require('../utils/file-io');

let totalRibbonLength = 0;

readLines('input.txt').forEach(present => {
  const [, length, width, height] = present.match(/(\d+)x(\d+)x(\d+)/);
  const perimeter = 2 * Math.min(...[length+width, width+height, length+height]);
  const volume = length * width * height;

  totalRibbonLength += perimeter + volume;
});

console.log(totalRibbonLength);
