const { readRaw } = require('../utils/file-io');

const instructions = readRaw('input.txt');

let currentIndex;
let currentFloor = 0;

[...instructions].some((char, index) => {
  currentIndex = index;
  currentFloor += char === '(' ? 1 : -1;

  return currentFloor < 0;
});

console.log(currentIndex + 1);
