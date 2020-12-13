const { readLines } = require('../../utils/file-io');

const part1 = (arrivalTime, busTimes) => {
  let minWaitingTime = Infinity;
  let firstBusTime;

  for (const busTime of busTimes) {
    if (isNaN(busTime)) {
      continue;
    }

    const waitingTime = busTime - arrivalTime % busTime;

    if (waitingTime < minWaitingTime) {
      minWaitingTime = waitingTime;
      firstBusTime = busTime;
    }
  }

  return minWaitingTime * firstBusTime;
};

const part2 = busTimes => {
  /*
    Solve for `time`:
      time + offset1 === 0 (mod busTime1)
      time + offset2 === 0 (mod busTime2)
      .
      .
      time + offsetN === 0 (mod busTimeN)
  */

  const offsets = busTimes.map((busTime, offset) => busTime && [busTime, offset]).filter(Boolean);
  let [time, product] = [0, 1];

  for (const [busTime, offset] of offsets) {
    while ((time + offset) % busTime > 0) {
      time += product;
    }

    product *= busTime;
  }

  return time;
};

const [[arrivalTime], busTimes] = readLines('input.txt').map(line => line.split(',').map(Number));

console.log(part1(arrivalTime, busTimes), part2(busTimes));
