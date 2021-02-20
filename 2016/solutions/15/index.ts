type Disk = {
  posCount: number,
  startPos: number
};

/*
 * Solve for `time` where N is the number of disks and 0 is the slot position:
 *
 *   time + 1 + disk1.startPos ≡ 0 (mod disk1.posCount)
 *   time + 2 + disk2.startPos ≡ 0 (mod disk2.posCount)
 *   .
 *   .
 *   time + N + diskN.startPos ≡ 0 (mod diskN.posCount)
 */
const findTimeForSlotAlignmentAtPosZero = (disks: Disk[]): number => {
  let [time, product] = [0, 1];

  for (const [idx, { posCount, startPos }] of Object.entries(disks)) {
    while ((time + (+idx + 1) + startPos) % posCount > 0) {
      time += product;
    }

    product *= posCount;
  }

  return time;
};

export const part1 = (disks: Disk[]): number => findTimeForSlotAlignmentAtPosZero(disks);

export const part2 = (disks: Disk[]): number => {
  disks.push({ posCount: 11, startPos: 0 });
  return findTimeForSlotAlignmentAtPosZero(disks);
};

export const parseInput = (input: string): Disk[] =>
  input.split('\n').map(line => {
    const [, posCount, startPos] = line.match(/has (\d+) positions; .+ is at position (\d+)/);
    return { posCount: +posCount, startPos: +startPos };
  });
