const presents = require('./input');

let totalSurfaceArea = 0;

presents.forEach(present => {
  const [length, width, height] = present;
  const surfaceAreas = [length*width, width*height, height*length];

  totalSurfaceArea += Math.min(...surfaceAreas) + 2 * (surfaceAreas[0] + surfaceAreas[1] + surfaceAreas[2]);
});

console.log(totalSurfaceArea);
