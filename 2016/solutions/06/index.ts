export const parseInput = (input: string): string[] => input.split('\n');

export const part1 = (msgs: string[]): string => reduceMessages(msgs, getMostCommonChar);
export const part2 = (msgs: string[]): string => reduceMessages(msgs, getLeastCommonChar);

const getMostCommonChar = (msgs: string[], idx: number): string => getCharsByCountAsc(msgs, idx).pop();
const getLeastCommonChar = (msgs: string[], idx: number): string => getCharsByCountAsc(msgs, idx).shift();

const getCharsByCountAsc = (msgs: string[], idx: number): string[] =>
  [...getCharCountsForIndex(msgs, idx).entries()].sort(([, a], [, b]) => +a - +b).map(([char]) => char);

const getCharCountsForIndex = (msgs: string[], idx: number): Map<string, number> =>
  msgs.reduce((counts, msg) => counts.set(msg[idx], counts.get(msg[idx]) + 1 || 1), new Map());

const reduceMessages = (msgs: string[], reduceCharsFn: Function): string => {
  let msg = '';

  for (let i = 0; i < msgs[0].length; ++i) {
    msg += reduceCharsFn(msgs, i);
  }

  return msg;
};
