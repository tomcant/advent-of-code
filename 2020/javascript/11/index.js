const { readLines } = require('../utils/file-io');

const OCCUPIED = '#';
const UNOCCUPIED = 'L';

const isOccupied = cell => OCCUPIED === cell;
const isUnoccupied = cell => UNOCCUPIED === cell;

const countAdjacentOccupiedSeats = (grid, pos) => countVisibleOccupiedSeats(grid, pos, 1);

const countVisibleOccupiedSeats = (grid, pos, maxDistance = Infinity) =>
  [
    [0, -1], [0, 1], [-1, 0], [1, 0],  // Horizontal/vertical
    [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal
  ]
    .reduce((count, diff) =>
      count + canSeeOccupiedSeatInDirection(grid, pos, diff, maxDistance),
      0
    );

const canSeeOccupiedSeatInDirection = (grid, [x, y], [xDiff, yDiff], maxDistance) => {
  let [xNext, yNext] = [x + xDiff, y + yDiff];
  let [width, height] = [grid[0].length, grid.length];

  while (maxDistance-- && xNext >= 0 && xNext < width && yNext >= 0 && yNext < height) {
    const state = grid[yNext][xNext];

    if (isOccupied(state)) {
      return true;
    }

    if (isUnoccupied(state)) {
      return false;
    }

    xNext += xDiff;
    yNext += yDiff;
  }

  return false;
};

const buildNextGrid = (grid, countVisibleOccupiedSeats, minOccupancyForSwap) => {
  const newGrid = [];

  for (let y = 0; y < grid.length; ++y) {
    let newRow = '';

    for (let x = 0; x < grid[y].length; ++x) {
      const occupancy = countVisibleOccupiedSeats(grid, [x, y]);
      let cell = grid[y][x];

      if (isOccupied(cell) && occupancy >= minOccupancyForSwap) {
        cell = UNOCCUPIED;
      } else if (isUnoccupied(cell) && 0 === occupancy) {
        cell = OCCUPIED;
      }

      newRow += cell;
    }

    newGrid.push(newRow);
  }

  return newGrid;
};

const findStableGrid = (grid, countVisibleOccupiedSeats, minOccupancyForSwap) => {
  let last = grid;
  let next;

  while (true) {
    next = buildNextGrid(last, countVisibleOccupiedSeats, minOccupancyForSwap);

    if (last.join() === next.join()) {
      break;
    }

    last = next;
  }

  return last;
};

const countOccupiedSeats = grid => grid.reduce((count, row) => count + row.split('').filter(isOccupied).length, 0);

const grid = readLines('input.txt');

const part1 = grid => countOccupiedSeats(findStableGrid(grid, countAdjacentOccupiedSeats, 4));
const part2 = grid => countOccupiedSeats(findStableGrid(grid, countVisibleOccupiedSeats, 5));

console.log(part1(grid), part2(grid));
