const { readRaw } = require('../utils/file-io');

const part1 = json => JSON.stringify(json).match(/-?\d+/g).reduce((sum, n) => sum + +n, 0);
const part2 = json => sumExcludingRedObjects(json);

const sumExcludingRedObjects = json => {
  if (json instanceof Array) {
    return json.reduce((sum, item) => sum + sumExcludingRedObjects(item), 0);
  }

  if (json instanceof Object) {
    const items = Object.entries(json).map(([, item]) => item);

    return items.includes('red') ? 0 : sumExcludingRedObjects(items);
  }

  return parseInt(json) || 0;
};

const json = JSON.parse(readRaw('input.txt'));

console.log('Part 1:', part1(json));
console.log('Part 2:', part2(json));
