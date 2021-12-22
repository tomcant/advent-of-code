export const parseInput = (input: string): number[] =>
  input.split("\n").map((line) => +line.split(": ")[1] - 1);

export const part1 = (pos: number[]): number => {
  const score = [0, 0];
  let iter = 0;

  while (score[0] < 1000 && score[1] < 1000) {
    const roll = 9 * iter + 6;
    const player = iter++ % 2;
    pos[player] = (pos[player] + roll) % 10;
    score[player] += pos[player] + 1;
  }

  return 3 * iter * Math.min(...score);
};

export const part2 = (pos: number[]): number =>
  Math.max(...countQuantumWins(pos));

const countQuantumWins = (pos: number[]): number[] => {
  const cache = new Map<string, number[]>();

  const hash = (pos, score, player) =>
    `${pos[0]}-${pos[1]}-${score[0]}-${score[1]}-${player}`;

  // prettier-ignore
  const rolls = [
    3,
    4, 4, 4,
    5, 5, 5, 5, 5, 5,
    6, 6, 6, 6, 6, 6, 6,
    7, 7, 7, 7, 7, 7,
    8, 8, 8,
    9,
  ];

  const count = (pos, score, player) => {
    const key = hash(pos, score, player);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const nextPlayer = player ^ 1;
    if (score[nextPlayer] >= 21) {
      return [0 ^ nextPlayer, 1 ^ nextPlayer];
    }

    let wins = [0, 0];

    for (const roll of rolls) {
      const nextPos = { ...pos, [player]: (pos[player] + roll) % 10 };
      const nextScore = {
        ...score,
        [player]: score[player] + nextPos[player] + 1,
      };
      const nextWins = count(nextPos, nextScore, nextPlayer);
      wins = [wins[0] + nextWins[0], wins[1] + nextWins[1]];
    }

    cache.set(key, wins);

    return wins;
  };

  return count(pos, [0, 0], 0);
};
