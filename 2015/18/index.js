const { readLines } = require('../utils/file-io');

const part1 = lights => {
  const isLightOn = (lights, x, y) => '#' === lights[y][x];

  return countLightsOn(step(lights, 100, isLightOn), isLightOn);
};

const part2 = lights => {
  const isLightOn = (lights, x, y) => '#' === lights[y][x]
    || (0 === x || lights[y].length - 1 === x)
    && (0 === y || lights.length - 1 === y);

  return countLightsOn(step(lights, 100, isLightOn), isLightOn);
};

const countLightsOn = (lights, isLightOnFn) => lights.reduce(
  (sum, line, y) => sum + [...line].reduce((sum, _, x) => sum + isLightOnFn(lights, x, y), 0),
  0
);

const step = (lights, steps, isLightOnFn) => {
  const states = { true: '#', false: '.' };
  let last = lights;

  while (steps--) {
    let next = [];

    for (let y = 0; y < lights.length; ++y) {
      let nextLine = '';

      for (let x = 0; x < lights[y].length; ++x) {
        const count = countNeighbouringLightsOn(last, x, y, isLightOnFn);
        nextLine += states[3 === count || isLightOnFn(last, x, y) && 2 === count];
      }

      next.push(nextLine);
    }

    last = next;
  }

  return last;
};

const countNeighbouringLightsOn = (lights, x, y, isLightOnFn) => {
  const directions = [
    [1, 0], [1, 1], [0, 1], [-1, 1],
    [-1, 0], [-1, -1], [0, -1], [1, -1]
  ];

  let count = 0;

  for (const [dx, dy] of directions) {
    if (x + dx >= 0 && x + dx < lights[0].length && y + dy >= 0 && y + dy < lights.length) {
      count += isLightOnFn(lights, x + dx, y + dy);
    }
  }

  return count;
};

const lights = readLines('input.txt');

console.log('Part 1:', part1(lights));
console.log('Part 2:', part2(lights));
