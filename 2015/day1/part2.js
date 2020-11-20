const instructions = require('./input');

let currentIndex;
let currentFloor = 0;

[...instructions].some((char, index) => {
  currentIndex = index;
  currentFloor += char === '(' ? 1 : -1;

  return currentFloor < 0;
});

console.log(currentIndex + 1);
