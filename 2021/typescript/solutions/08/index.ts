type Signal = string;
type SignalMap = { [_: string]: number };
type Display = [Signal, Signal, Signal, Signal];

export const parseInput = (input: string): [Signal[], Display][] =>
  input
    .split("\n")
    .map(
      (line) =>
        line
          .split(" | ")
          .map((signals) =>
            signals.split(" ").map((s) => [...s].sort().join(""))
          ) as [Signal[], Display]
    );

export const part1 = (input: [Signal[], Display][]): number =>
  input.reduce(
    (sum, [, display]) =>
      sum +
      display.filter((signal) => [2, 3, 4, 7].includes(signal.length)).length,
    0
  );

export const part2 = (input: [Signal[], Display][]): number => {
  let sum = 0;

  const findSignal = (signals, segmentCount) =>
    signals.find((s) => s.length === segmentCount);

  const findOne = (signals) => findSignal(signals, 2);
  const findFour = (signals) => findSignal(signals, 4);
  const findSeven = (signals) => findSignal(signals, 3);
  const findEight = (signals) => findSignal(signals, 7);

  for (const [signals, display] of input) {
    const signalMap = {
      1: findOne(signals),
      [findOne(signals)]: 1,
      [findFour(signals)]: 4,
      [findSeven(signals)]: 7,
      [findEight(signals)]: 8,
    };

    const twoThreeFive = signals.filter((s) => s.length === 5);
    const zeroSixNine = signals.filter((s) => s.length === 6);

    const [three, twoFive] = identifySignal(twoThreeFive, signalMap[1], 0);
    const [six, zeroNine] = identifySignal(zeroSixNine, signalMap[1], 1);
    const [two, [five]] = identifySignal(twoFive, six, 2);
    const [zero, [nine]] = identifySignal(zeroNine, three, 1);

    signalMap[zero] = 0;
    signalMap[two] = 2;
    signalMap[three] = 3;
    signalMap[five] = 5;
    signalMap[six] = 6;
    signalMap[nine] = 9;

    sum += calcDisplaySum(display, signalMap);
  }

  return sum;
};

const identifySignal = (
  unidentified: Signal[],
  marker: Signal,
  diffLength: number
): [Signal, Signal[]] => {
  for (const signal of unidentified) {
    if (subtract(signal, marker).length === diffLength) {
      return [signal, unidentified.filter((s) => s !== signal)];
    }
  }
};

const subtract = (signal: Signal, from: Signal): string[] =>
  [...from].filter((x) => ![...signal].includes(x));

const calcDisplaySum = (display: Display, signalMap: SignalMap): number =>
  Number(display.map((signal) => signalMap[signal]).join(""));
