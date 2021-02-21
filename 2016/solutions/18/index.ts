enum Tile {
  Safe = '.',
  Trap = '^'
}

const countSafeTiles = (firstRow: string, numRows: number): number => {
  const TRAP_SUMS = [
    1, // 1 + 0 + 0 = left
    3, // 1 + 2 + 0 = left + center
    6, // 0 + 2 + 4 = center + right
    4  // 0 + 0 + 4 = right
  ];

  const countForRow = (row: string): number =>
    row.match(RegExp('\\' + Tile.Safe, 'g')).length;

  let count = countForRow(firstRow);
  let prevRow = firstRow;

  for (let i = 0; i < numRows - 1; ++i) {
    let nextRow = '';

    for (let j = 0; j < prevRow.length; ++j) {
      let trapSum = 0;

      for (let k = j - 1; k <= j + 1; ++k) {
        if (k >= 0 && k < prevRow.length && Tile.Trap === prevRow[k]) {
          trapSum += 1 << k - j + 1;
        }
      }

      nextRow += TRAP_SUMS.includes(trapSum) ? Tile.Trap : Tile.Safe;
    }

    count += countForRow(nextRow);
    prevRow = nextRow;
  }

  return count;
};

export const part1 = (firstRow: string): number => countSafeTiles(firstRow, 40);
export const part2 = (firstRow: string): number => countSafeTiles(firstRow, 400000);

export const parseInput = (input: string): string => input;
