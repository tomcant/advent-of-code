const { readLines } = require('../../utils/file-io');

const countTrees = (right, down, map) => map.reduce(
  (trees, line, index) => index % down > 0 ? trees :
    trees + ('#' === line[((index / down) * right) % line.length]),
  0
);

const map = readLines('input.txt');

console.log(countTrees(3, 1, map));

console.log(
  [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].reduce(
    (product, [right, down]) => product * countTrees(right, down, map),
    1
  )
);
