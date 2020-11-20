const presents = require('./input');

let totalRibbonLength = 0;

presents.forEach(present => {
  const [length, width, height] = present;
  const perimeter = 2 * Math.min(...[length+width, width+height, length+height]);
  const volume = length * width * height;

  totalRibbonLength += perimeter + volume;
});

console.log(totalRibbonLength);
