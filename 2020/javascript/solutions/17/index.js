const { readLines } = require('../../utils/file-io');

const generateNextStep = (activePoints) => {
  let [[minX, minY, minZ, minW], [maxX, maxY, maxZ, maxW]] =
    [Array(4).fill(Infinity), Array(4).fill(-Infinity)];

  for (const [x, y, z, w] of activePoints) {
    minX = x < minX ? x : minX; maxX = x > maxX ? x : maxX;
    minY = y < minY ? y : minY; maxY = y > maxY ? y : maxY;
    minZ = z < minZ ? z : minZ; maxZ = z > maxZ ? z : maxZ;
    minW = w < minW ? w : minW; maxW = w > maxW ? w : maxW;
  }

  const newPoints = [];

  for (let x = minX - 1; x <= maxX + 1; ++x) {
    for (let y = minY - 1; y <= maxY + 1; ++y) {
      for (let z = minZ - 1; z <= maxZ + 1; ++z) {
        for (let w = minW - 1; w <= maxW + 1; ++w) {
          const point = [x, y, z, w];
          const activeNeighbours = findActiveNeighbours(point, activePoints);
          const isActive = activePoints.some(p => 1 > calcPointDiff(p, point).reduce((sum, d) => sum + d, 0));

          if (isActive) {
            if (2 === activeNeighbours.length || 3 === activeNeighbours.length) {
              newPoints.push(point);
            }
          } else if (3 === activeNeighbours.length) {
            newPoints.push(point);
          }
        }
      }
    }
  }

  return newPoints;
};

const findActiveNeighbours = (point, activePoints) => {
  const neighbours = [];

  for (const activePoint of activePoints) {
    const diff = calcPointDiff(point, activePoint);

    if (diff.every(d => d <= 1) && 0 < diff.reduce((sum, d) => sum + d, 0)) {
      neighbours.push(activePoint);
    }
  }

  return neighbours;
};

const calcPointDiff = ([x1, y1, z1, w1], [x2, y2, z2, w2]) =>
  [Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2), Math.abs(w1 - w2)];

const part2 = activePoints => {
  for (let cycle = 0; cycle < 6; ++cycle) {
    activePoints = generateNextStep(activePoints);
  }

  return activePoints.length;
};

const activePoints = [];

readLines('input.txt').forEach((line, y) => {
  [...line].forEach((char, x) => {
    if ('#' === char) {
      activePoints.push([x, y, 0, 0]);
    }
  });
});

console.log(part2([...activePoints]));
