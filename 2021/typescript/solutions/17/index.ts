export const parseInput = (input: string): number[] =>
  input
    .match(/x=(-?\d+)\.\.(-?\d+),\sy=(-?\d+)\.\.(-?\d+)/)
    .slice(1)
    .map(Number);

export const part1 = (coords: number[]): number => {
  const [maxY] = simulate(coords);
  return maxY;
};

export const part2 = (coords: number[]): number => {
  const [, count] = simulate(coords);
  return count;
};

const simulate = ([bx1, bx2, by1, by2]: number[]): [number, number] => {
  let [maxY, count] = [0, 0];

  for (let vx = 1; vx <= bx2; ++vx) {
    for (let vy = by1; vy <= 100; ++vy) {
      let [x, y] = [0, 0];
      let [thisVx, thisVy] = [vx, vy];
      let thisMaxY = 0;

      while ((x < bx1 || y > by2) && x <= bx2 && y >= by1) {
        [x, y] = [x + thisVx, y + thisVy];
        [thisVx, thisVy] = [thisVx ? thisVx - 1 : 0, thisVy - 1];
        thisMaxY = Math.max(y, thisMaxY);
      }

      if (x <= bx2 && y >= by1) {
        maxY = Math.max(thisMaxY, maxY);
        count += 1;
      }
    }
  }

  return [maxY, count];
};
