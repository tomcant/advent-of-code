type Board = {
  cols: number[][];
  rows: number[][];
};

type Bingo = {
  numbers: number[];
  boards: Board[];
};

export const parseInput = (input: string): Bingo => {
  const [numbers, ...boards] = input.split("\n\n");

  return {
    numbers: numbers.split(",").map(Number),
    boards: boards.map((board) => {
      const rows = board
        .split("\n")
        .map((line) => line.trim().split(/\s+/).map(Number));

      let cols = [];
      for (let i = 0; i < rows.length; ++i) {
        cols.push([]);
        for (const row of rows) {
          cols[i].push(row[i]);
        }
      }

      return { cols, rows };
    }),
  };
};

export const part1 = ({ numbers, boards }: Bingo): number => {
  for (const num of numbers) {
    for (const board of boards) {
      for (const row in board.rows) {
        board.rows[row] = board.rows[row].filter((v) => v !== num);
      }
      for (const col in board.cols) {
        board.cols[col] = board.cols[col].filter((v) => v !== num);
      }
      if (isWin(board)) {
        return scoreBoard(board) * num;
      }
    }
  }
};

export const part2 = ({ numbers, boards }: Bingo): number => {
  const winningBoardIndices = [];
  let lastWinningScore = 0;

  for (const num of numbers) {
    for (const idx in boards) {
      if (winningBoardIndices.includes(idx)) {
        continue;
      }

      const board = boards[idx];

      for (const row in board.rows) {
        board.rows[row] = board.rows[row].filter((v) => v !== num);
      }

      for (const col in board.cols) {
        board.cols[col] = board.cols[col].filter((v) => v !== num);
      }

      if (isWin(board)) {
        winningBoardIndices.push(idx);
        lastWinningScore = scoreBoard(board) * num;
      }
    }
  }

  return lastWinningScore;
};

const isWin = ({ cols, rows }: Board): boolean =>
  [...cols, ...rows].some((x) => x.length === 0);

const scoreBoard = ({ rows }: Board): number =>
  rows.reduce(
    (sum, row) => sum + row.reduce((sum, value) => sum + value, 0),
    0
  );
