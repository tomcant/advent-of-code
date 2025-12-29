const { readLines } = require('../../utils/file-io');

const part1 = grid => runCycles(parseActive(grid, 3), 3);
const part2 = grid => runCycles(parseActive(grid, 4), 4);

const runCycles = (active, dims) => {
  const deltas = makeDeltas(dims);

  for (let cycle = 0; cycle < 6; ++cycle) {
    active = step(active, deltas);
  }

  return active.size;
};

const parseActive = (grid, dims) => {
  const active = new Set();

  grid.forEach((line, y) => {
    [...line].forEach((char, x) => {
      if ('#' !== char) {
        return;
      }

      const coords = [x, y];

      while (coords.length < dims) {
        coords.push(0);
      }

      active.add(coords.join(','));
    });
  });

  return active;
};

const makeDeltas = dims => {
  const deltas = [];

  const build = (delta) => {
    if (delta.length === dims) {
      if (delta.some(d => 0 !== d)) {
        deltas.push(delta.slice());
      }
      return;
    }

    for (let d = -1; d <= 1; ++d) {
      delta.push(d);
      build(delta);
      delta.pop();
    }
  };

  build([]);

  return deltas;
};

const step = (active, deltas) => {
  const counts = new Map();

  for (const key of active) {
    const coords = key.split(',').map(Number);

    for (const delta of deltas) {
      const neighbour = coords.map((c, i) => c + delta[i]).join(',');
      counts.set(neighbour, (counts.get(neighbour) || 0) + 1);
    }
  }

  const next = new Set();

  for (const [key, count] of counts) {
    if (3 === count || 2 === count && active.has(key)) {
      next.add(key);
    }
  }

  return next;
};

const grid = readLines('input.txt');

console.log('Part 1:', part1(grid));
console.log('Part 2:', part2(grid));
