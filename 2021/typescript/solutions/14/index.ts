type Element = string;
type Pair = [Element, Element];
type Insertions = Map<string, Element>;
type Counters = Map<Element, number>;

export const parseInput = (input: string): [string, Insertions] => {
  const groups = input.split("\n\n");

  const pairInsertions = new Map(
    groups[1].split("\n").map((line) => line.split(" -> ") as [string, Element])
  );

  return [groups[0], pairInsertions];
};

export const part1 = ([template, insertions]: [string, Insertions]): number =>
  count(template, insertions, 10);

export const part2 = ([template, insertions]: [string, Insertions]): number =>
  count(template, insertions, 40);

const count = (
  template: string,
  insertions: Insertions,
  steps: number
): number => {
  const cache = new Map<string, Counters>();

  const doCount = (pair: Pair, step = 0) => {
    const [first, second] = pair;
    const hash = `${first}${second}${step}`;

    if (cache.has(hash)) {
      return cache.get(hash);
    }

    if (step === steps) {
      return new Map();
    }

    const elem = insertions.get(`${first}${second}`);

    const counters = mergeCounters(
      doCount([first, elem], step + 1),
      doCount([elem, second], step + 1)
    );

    counters.set(elem, (counters.get(elem) || 0) + 1);
    cache.set(hash, counters);

    return counters;
  };

  const pairs = [...template.substr(1)].map(
    (elem, idx) => [template[idx], elem] as Pair
  );

  const counters = pairs.reduce(
    (acc, pair) => mergeCounters(acc, doCount(pair)),
    buildFrequencyMap(template)
  );

  const counts = [...counters.values()];

  return Math.max(...counts) - Math.min(...counts);
};

const mergeCounters = (first: Counters, second: Counters): Counters =>
  [...first].reduce(
    (acc, [elem, count]) => acc.set(elem, (acc.get(elem) || 0) + count),
    new Map([...second])
  );

const buildFrequencyMap = (str: string): Counters =>
  [...str].reduce(
    (acc, elem) => acc.set(elem, (acc.get(elem) || 0) + 1),
    new Map()
  );
