export const parseInput = (input: string): Vec3d[][] =>
  input
    .split("\n\n")
    .map((scanner) => scanner.split("\n").slice(1).map(Vec3d.fromString));

export const part1 = (scannerBeacons: Vec3d[][]): number => {
  const [uniqueBeacons] = assembleMap(scannerBeacons);
  return uniqueBeacons.size;
};

export const part2 = (scannerBeacons: Vec3d[][]): number => {
  const [, scannerPositions] = assembleMap(scannerBeacons);
  let maxDistance = 0;

  for (let i = 0; i < scannerPositions.length; ++i) {
    for (let j = 0; j < scannerPositions.length; ++j) {
      if (i === j) continue;

      maxDistance = Math.max(
        maxDistance,
        manhattanDistance(scannerPositions[i], scannerPositions[j])
      );
    }
  }

  return maxDistance;
};

const assembleMap = (scannerBeacons: Vec3d[][]): [Set<string>, Vec3d[]] => {
  const scannerPositions = [];
  const uniqueBeacons = new Set<string>();

  for (const beacon of scannerBeacons.shift()) {
    uniqueBeacons.add(beacon.toString());
  }

  while (scannerBeacons.length > 0) {
    for (let idx = 0; idx < scannerBeacons.length; ++idx) {
      for (const orientedScanner of getOrientations(scannerBeacons[idx])) {
        const relativePosition = findRelativeScannerPos(
          uniqueBeacons,
          orientedScanner
        );

        if (relativePosition) {
          orientedScanner
            .map((beacon) => beacon.add(relativePosition))
            .forEach((beacon) => uniqueBeacons.add(beacon.toString()));

          scannerPositions.push(relativePosition);
          scannerBeacons.splice(idx, 1);
          break;
        }
      }
    }
  }

  return [uniqueBeacons, scannerPositions];
};

const findRelativeScannerPos = (
  beacons: Set<string>,
  scanner: Vec3d[]
): Vec3d | null => {
  const parsedBeacons = [...beacons].map(Vec3d.fromString);

  for (const beacon of parsedBeacons) {
    for (const scannerBeacon of scanner) {
      const scannerPosition = beacon.sub(scannerBeacon);

      const overlap = scanner
        .map((beacon) => scannerPosition.add(beacon))
        .filter((beacon) => beacons.has(beacon.toString()));

      if (overlap.length >= 12) {
        return scannerPosition;
      }
    }
  }

  return null;
};

class Vec3d {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}

  public add(v: Vec3d): Vec3d {
    return new Vec3d(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public sub(v: Vec3d): Vec3d {
    return new Vec3d(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  public static fromString(s: string): Vec3d {
    const [, x, y, z] = s.match(/(-?\d+),(-?\d+),(-?\d+)/);
    return new Vec3d(+x, +y, +z);
  }
}

const getOrientations = function* (beacons: Vec3d[]): Generator<Vec3d[]> {
  for (const transformer of getOrientationTransforms()) {
    yield beacons.map(transformer);
  }
};

const getOrientationTransforms = function* (): Generator<(v: Vec3d) => Vec3d> {
  yield (v) => new Vec3d(-v.z, -v.y, -v.x);
  yield (v) => new Vec3d(-v.z, -v.x, v.y);
  yield (v) => new Vec3d(-v.z, v.x, -v.y);
  yield (v) => new Vec3d(-v.z, v.y, v.x);
  yield (v) => new Vec3d(-v.y, -v.z, v.x);
  yield (v) => new Vec3d(-v.y, -v.x, -v.z);
  yield (v) => new Vec3d(-v.y, v.x, v.z);
  yield (v) => new Vec3d(-v.y, v.z, -v.x);
  yield (v) => new Vec3d(-v.x, -v.z, -v.y);
  yield (v) => new Vec3d(-v.x, -v.y, v.z);
  yield (v) => new Vec3d(-v.x, v.y, -v.z);
  yield (v) => new Vec3d(-v.x, v.z, v.y);
  yield (v) => new Vec3d(v.x, -v.z, v.y);
  yield (v) => new Vec3d(v.x, -v.y, -v.z);
  yield (v) => new Vec3d(v.x, v.y, v.z);
  yield (v) => new Vec3d(v.x, v.z, -v.y);
  yield (v) => new Vec3d(v.y, -v.z, -v.x);
  yield (v) => new Vec3d(v.y, -v.x, v.z);
  yield (v) => new Vec3d(v.y, v.x, -v.z);
  yield (v) => new Vec3d(v.y, v.z, v.x);
  yield (v) => new Vec3d(v.z, -v.y, v.x);
  yield (v) => new Vec3d(v.z, -v.x, -v.y);
  yield (v) => new Vec3d(v.z, v.x, v.y);
  yield (v) => new Vec3d(v.z, v.y, -v.x);
};

const manhattanDistance = (a: Vec3d, b: Vec3d): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
