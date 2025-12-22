const { readRaw } = require('../../utils/file-io');

const part1 = instructions => {
  const position = { x: 0, y: 0 };
  const visited = { '0,0': true };

  const directions = {
    '^': ['y', 1],
    '>': ['x', 1],
    'v': ['y', -1],
    '<': ['x', -1]
  };

  for (let i = 0; i < instructions.length; ++i) {
    position[directions[instructions[i]][0]] += directions[instructions[i]][1];
    visited[`${position.x},${position.y}`] = true;
  }

  return Object.keys(visited).length;
};

const part2 = instructions => {
  const positions = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  const visited = { '0,0': true };

  const directions = {
    '^': ['y', 1],
    '>': ['x', 1],
    'v': ['y', -1],
    '<': ['x', -1]
  };

  for (let i = 0; i < instructions.length; ++i) {
    const position = positions[i % 2];
    position[directions[instructions[i]][0]] += directions[instructions[i]][1];
    visited[`${position.x},${position.y}`] = true;
  }

  return Object.keys(visited).length;
};

const instructions = readRaw('input.txt');

console.log('Part 1:', part1(instructions));
console.log('Part 2:', part2(instructions));
