type Cave = string;
type CaveMap = Map<Cave, Cave[]>;

export const parseInput = (input: string): CaveMap => {
  const map = new Map<Cave, Cave[]>();

  const connectCaves = (from, to) => {
    if (from === "end" || to === "start") return;
    map.set(from, [to, ...(map.get(from) || [])]);
  };

  for (const line of input.split("\n")) {
    const [from, to] = line.split("-");
    connectCaves(from, to);
    connectCaves(to, from);
  }

  return map;
};

export const part1 = (map: CaveMap): number =>
  search(map, (path) => {
    const smallCaves = path.filter(isCaveSmall);
    return smallCaves.length === new Set(smallCaves).size;
  });

export const part2 = (map: CaveMap): number =>
  search(map, (path) => {
    const smallCaves = path.filter(isCaveSmall);
    return smallCaves.length < new Set(smallCaves).size + 2;
  });

const search = (
  map: CaveMap,
  isPathValid: (path: Cave[]) => boolean
): number => {
  let pathCount = 0;

  (function doSearch(cave, path) {
    if (cave === "end") {
      pathCount += 1;
      return;
    }

    const nextPath = [...path, cave];

    if (!isPathValid(nextPath)) {
      return;
    }

    for (const nextCave of map.get(cave)) {
      doSearch(nextCave, nextPath);
    }
  })("start", []);

  return pathCount;
};

const isCaveSmall = (cave: Cave): boolean => cave === cave.toLowerCase();
