const { readLines } = require('../../utils/file-io');

const part1 = instructions => countLightsOn(
  runInstructions(instructions, (currentState, instructionType) => {
    switch (instructionType) {
      case 'turn on':
        return 1;
      case 'turn off':
        return 0;
      case 'toggle':
        return currentState ^= 1;
    }
  })
);

const part2 = instructions => countLightsOn(
  runInstructions(instructions, (currentState, instructionType) => {
    switch (instructionType) {
      case 'turn on':
        return currentState + 1;
      case 'turn off':
        return Math.max(currentState - 1, 0);
      case 'toggle':
        return currentState + 2;
    }
  })
);

const runInstructions = (instructions, getNewStateFn) => {
  const grid = [];

  for (let i = 0; i < 1000; ++i) {
    grid.push(new Array(1000).fill(0));
  }

  for (const instruction of instructions) {
    const [, instructionType, xStart, yStart, xStop, yStop] =
      instruction.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/);

    for (let y = +yStart; y <= +yStop; ++y) {
      for (let x = +xStart; x <= +xStop; ++x) {
        grid[y][x] = getNewStateFn(grid[y][x], instructionType);
      }
    }
  }

  return grid;
};

const countLightsOn = grid => grid.reduce(
  (cnt, lights) => cnt + lights.reduce((cnt, lightOn) => cnt + lightOn, 0),
  0
);

const instructions = readLines('input.txt');

console.log('Part 1:', part1(instructions));
console.log('Part 2:', part2(instructions));
