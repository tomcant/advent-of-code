type Report = number[];

export const parseInput = (input: string): Report =>
  input.split("\n").map((n) => parseInt(n, 2));

export const part1 = (report: Report): number => powerConsumption(report);
export const part2 = (report: Report): number => lifeSupportRating(report);

const powerConsumption = (report: Report): number =>
  gammaRate(report) * epsilonRate(report);

const gammaRate = (report: Report): number => calcRate(report, 1);
const epsilonRate = (report: Report): number => calcRate(report, 0);

const calcRate = (report: Report, bit: number): number => {
  let rate = 0;

  for (let idx = reportMsb(report) - 1; idx >= 0; --idx) {
    if (bit === mostCommonBit(report, idx)) {
      rate |= 1 << idx;
    }
  }

  return rate;
};

const lifeSupportRating = (report: Report): number =>
  oxygenGeneratorRating(report) * co2ScrubberRating(report);

const oxygenGeneratorRating = (report: Report): number =>
  reduceReport(report, mostCommonBit, 1);

const co2ScrubberRating = (report: Report): number =>
  reduceReport(report, leastCommonBit, 0);

const reduceReport = (
  report: Report,
  commonBitFn: (report: Report, idx: number) => number,
  defaultBit: number
): number => {
  let idx = reportMsb(report);

  while (report.length > 1) {
    const mcb = commonBitFn(report, --idx) ?? defaultBit;
    report = report.filter((v) => ((v >> idx) & 1) === mcb);
  }

  return report[0];
};

const mostCommonBit = (report: Report, idx: number): number | null => {
  const ones = report.filter((v) => ((v >> idx) & 1) === 1).length;
  if (ones > report.length - ones) return 1;
  if (ones < report.length - ones) return 0;
  return null;
};

const leastCommonBit = (report: Report, idx: number): number | null => {
  const mcb = mostCommonBit(report, idx);
  return mcb !== null ? mcb ^ 1 : null;
};

const reportMsb = (report: Report): number =>
  Math.max(...report.map((v) => msb(v)));

const msb = (n: number): number => {
  for (let i = 0; ; ++i) {
    if (n <= 1 << i) return i;
  }
};
