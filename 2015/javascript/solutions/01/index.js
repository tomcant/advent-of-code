const { readRaw } = require('../../utils/file-io');

const part1 = instructions => instructions.match(/\(/g).length - instructions.match(/\)/g).length;

const part2 = instructions => {
  let currentFloor = 0;
  let currentIndex = 0;

  for (const instruction of instructions) {
    currentFloor += instruction === '(' ? 1 : -1;
    currentIndex += 1;

    if (currentFloor < 0) {
      return currentIndex;
    }
  }
};

const instructions = readRaw('input.txt');

console.log('Part 1:', part1(instructions));
console.log('Part 2:', part2(instructions));
