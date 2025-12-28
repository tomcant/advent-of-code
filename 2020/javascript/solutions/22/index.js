const { readGroupedLines } = require('../../utils/file-io');

const play = (p1deck, p2deck, recursive) => {
  const seen = new Set();

  while (p1deck.length > 0 && p2deck.length > 0) {
    const key = [p1deck.join(), p2deck.join()].join('-');

    if (seen.has(key)) {
      return { p1wins: true };
    }

    seen.add(key);

    const [p1turn, p2turn] = [p1deck.shift(), p2deck.shift()];
    let p1wins = p1turn > p2turn;

    if (recursive && p1deck.length >= p1turn && p2deck.length >= p2turn) {
      p1wins = play(p1deck.slice(0, p1turn), p2deck.slice(0, p2turn), recursive).p1wins;
    }

    if (p1wins) {
      p1deck.push(p1turn, p2turn);
    } else {
      p2deck.push(p2turn, p1turn);
    }
  }

  return {
    p1wins: p1deck.length > 0,
    deck: [...p1deck, ...p2deck]
  };
};

const score = deck => deck.reduce((score, card, index) => score + card * (deck.length - index), 0);

const part1 = (p1deck, p2deck) => score(play(p1deck, p2deck, false).deck);
const part2 = (p1deck, p2deck) => score(play(p1deck, p2deck, true).deck);

const [[, ...p1deck], [, ...p2deck]] = readGroupedLines('input.txt').map(p => p.map(Number));

console.log('Part 1:', part1([...p1deck], [...p2deck]));
console.log('Part 2:', part2([...p1deck], [...p2deck]));
