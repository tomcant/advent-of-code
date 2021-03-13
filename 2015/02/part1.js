const { readLines } = require('../utils/file-io');

let totalSurfaceArea = 0;

readLines('input.txt').forEach(present => {
  const [length, width, height] = present.match(/(\d+)x(\d+)x(\d+)/);
  const surfaceAreas = [length*width, width*height, height*length];

  totalSurfaceArea += Math.min(...surfaceAreas) + 2 * (surfaceAreas[0] + surfaceAreas[1] + surfaceAreas[2]);
});

console.log(totalSurfaceArea);
