const { readLines } = require('../../utils/file-io');

const directions = {
  N: ['y', 1],
  S: ['y', -1],
  E: ['x', 1],
  W: ['x', -1]
};

const processInstructions = (instructions, initialDiff, moveFn) => {
  let [pos, diff] = [{ x: 0, y: 0 }, initialDiff];

  for (let [op, arg] of instructions) {
    switch (op) {
      case 'F':
        pos.x += diff.x * arg;
        pos.y += diff.y * arg;
        break;
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        const move = moveFn(pos, diff, arg, directions[op]);
        pos = move.pos;
        diff = move.diff;
        break;
      case 'L':
        arg = 360 - arg;
      case 'R':
        while ((arg -= 90) >= 0) {
          diff = { x: diff.y, y: -diff.x };
        }
    }
  }

  return pos;
};

const calcManhattanDistance = ({ x, y }) => Math.abs(x) + Math.abs(y);

const part1 = instructions => calcManhattanDistance(
  processInstructions(instructions, { x: 1, y: 0 }, (pos, diff, distance, [axis, direction]) =>
    ({ pos: { ...pos, [axis]: pos[axis] + direction * distance }, diff }))
);

const part2 = instructions => calcManhattanDistance(
  processInstructions(instructions, { x: 10, y: 1 }, (pos, diff, distance, [axis, direction]) =>
    ({ pos, diff: { ...diff, [axis]: diff[axis] + direction * distance } }))
);

const instructions = readLines('input.txt')
  .map(line => line.match(/(\w)(\d+)/).slice(1))
  .map(([op, arg]) => [op, +arg]);

console.log(part1(instructions), part2(instructions));
