const { readRaw } = require('../../utils/file-io');

const instructions = readRaw('input.txt');
const position = { x: 0, y: 0 };
const visited = { '0,0': true };

const directions = {
  '^': ['y', 1],
  '>': ['x', 1],
  'v': ['y', -1],
  '<': ['x', -1]
};

[...instructions].forEach(direction => {
  position[directions[direction][0]] += directions[direction][1];
  visited[`${position.x},${position.y}`] = true;
});

console.log(Object.keys(visited).length);
