const { readLines } = require('../utils/file-io');

const grid = [];

for (let i = 0; i < 1000; ++i) {
  grid.push(new Array(1000).fill(0));
}

readLines('input.txt').forEach(instruction => {
  const [, instructionType, xStart, yStart, xStop, yStop] =
    instruction.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/);

  for (let y = parseInt(yStart); y <= parseInt(yStop); ++y) {
    for (let x = parseInt(xStart); x <= parseInt(xStop); ++x) {
      switch (instructionType) {
        case 'turn on':
          grid[y][x] = 1;
          break;
        case 'turn off':
          grid[y][x] = 0;
          break;
        case 'toggle':
          grid[y][x] ^= 1;
          break;
      }
    }
  }
});

console.log(grid.reduce((count, lights) => count + lights.reduce((count, lightOn) => count + lightOn, 0), 0));
