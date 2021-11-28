enum Tile {
  Safe = '.',
  Trap = '^'
}

export const parseInput = (input: string): string => input;

export const part1 = (firstRow: string): number => countSafeTiles(firstRow, 40);
export const part2 = (firstRow: string): number => countSafeTiles(firstRow, 400000);

const countSafeTiles = (firstRow: string, numRows: number): number => {
  const countForRow = (row: string): number =>
    row.match(RegExp('\\' + Tile.Safe, 'g')).length;

  let count = countForRow(firstRow);
  let prevRow = firstRow;

  for (let i = 0; i < numRows - 1; ++i) {
    let nextRow = '';

    for (let j = 0; j < prevRow.length; ++j) {
      const left = j - 1 >= 0 && Tile.Trap === prevRow[j - 1];
      const right = j + 1 < prevRow.length && Tile.Trap === prevRow[j + 1];

      nextRow += +left ^ +right ? Tile.Trap : Tile.Safe;
    }

    count += countForRow(nextRow);
    prevRow = nextRow;
  }

  return count;
};
