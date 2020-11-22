const instructions = require('./input');

const grid = [];

for (let i = 0; i < 1000; ++i) {
  grid.push(new Array(1000).fill(0));
}

instructions.forEach(instruction => {
  const [, instructionType, xStart, yStart, xStop, yStop] =
    instruction.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/);

  for (let y = parseInt(yStart); y <= parseInt(yStop); ++y) {
    for (let x = parseInt(xStart); x <= parseInt(xStop); ++x) {
      switch (instructionType) {
        case 'turn on':
          grid[y][x] += 1;
          break;
        case 'turn off':
          let newBrightness = grid[y][x] - 1;

          if (newBrightness < 0) {
            newBrightness = 0;
          }

          grid[y][x] = newBrightness;
          break;
        case 'toggle':
          grid[y][x] += 2;
          break;
      }
    }
  }
});

console.log(grid.reduce((count, lights) => count + lights.reduce((count, lightOn) => count + lightOn, 0), 0));
