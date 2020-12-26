const { readRaw } = require('../../utils/file-io');

// Due to the array manipulation performed in this solution it won't be efficient enough to complete part 2 in any
// reasonable timeframe. See `index.js` for a more efficient solution using a circular linked list instead.

const play = (cups, maxCup, iterations) => {
  let current = 0;

  while (iterations--) {
    let searchCup = cups[current] - 1;
    let pickedCups = cups.splice(current + 1, 3);
    let circularCorrection = 3 - pickedCups.length;

    if (pickedCups.length < 3) {
      pickedCups.push(...cups.splice(0, circularCorrection));
    }

    let destination;

    do {
      if (searchCup < 1) {
        searchCup = maxCup;
      }

      destination = cups.indexOf(searchCup--);
    } while (destination < 0);

    cups = [
      ...cups.slice(0, destination + 1),
      ...pickedCups,
      ...cups.slice(destination + 1)
    ];

    if (current++ > destination) {
      current += 3 - circularCorrection;
    }

    current %= cups.length;
  }

  return cups;
};

const part1 = cups => {
  cups = play(cups, Math.max(...cups), 100);

  return [
    ...cups.slice(cups.indexOf(1) + 1),
    ...cups.slice(0, cups.indexOf(1))
  ].join('');
};

console.log(part1(readRaw('input.txt').split('').map(Number)));
