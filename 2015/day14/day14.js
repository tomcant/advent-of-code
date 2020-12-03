const { readLines } = require('../../utils/file-io');

const reindeer = [];

readLines('input.txt').forEach(line => {
  const [, kms, moveSeconds, restSeconds] = line.match(/.+\s(\d+).+\s(\d+).+\s(\d+)/).map(n => parseInt(n) || n);

  reindeer.push({
    kms,
    moveSeconds,
    restSeconds,
    isMoving: true,
    secondsInTheLead: 0,
    distance: 0,
    clock: 0
  });
});

const simulateRace = (reindeer, stopTime) => {
  for (let i = 0; i < stopTime; ++i) {
    for (const r of reindeer) {
      r.clock += 1;

      if (r.isMoving) {
        r.distance += r.kms;

        if (r.clock === r.moveSeconds) {
          r.clock = 0;
          r.isMoving = false;
        }
      } else if (r.clock === r.restSeconds) {
        r.clock = 0;
        r.isMoving = true;
      }
    }

    findWinnerByField(reindeer, 'distance').secondsInTheLead += 1;
  }

  return reindeer;
};

const findWinnerByField = (reindeer, field) => reindeer.reduce(
  (winner, r) => r[field] > winner[field] ? r : winner,
  { [field]: -1 }
);

const simulation = simulateRace(reindeer, 2503);

console.log(findWinnerByField(simulation, 'distance').distance);
console.log(findWinnerByField(simulation, 'secondsInTheLead').secondsInTheLead);
