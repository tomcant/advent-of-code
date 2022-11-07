from collections import defaultdict


def parse_input(input):
    return [tuple(map(int, line.split(', '))) for line in input.splitlines()]


def part1(coords):
    max_x, max_y = find_bound(coords)
    sizes = defaultdict(int)
    infinites = set()

    for x in range(max_x + 1):
        for y in range(max_y + 1):
            distances = {coord: dist((x, y), coord) for coord in coords}

            ((closest, dist1), (_, dist2), *_) = \
                sorted(distances.items(), key=lambda tup: tup[1])

            if dist1 != dist2:
                sizes[closest] += 1

                if not (0 < x < max_x and 0 < y < max_y):
                    infinites.add(closest)

    return max(size for coord, size in sizes.items() if coord not in infinites)


def part2(coords):
    max_x, max_y = find_bound(coords)
    region = set()

    for x in range(max_x + 1):
        for y in range(max_y + 1):
            if sum(dist((x, y), coord) for coord in coords) < 10_000:
                region.add((x, y))

    return len(region)


def dist(p1, p2):
    (x1, y1), (x2, y2) = p1, p2
    return abs(x1 - x2) + abs(y1 - y2)


def find_bound(coords):
    return max(x for x, _ in coords), max(y for _, y in coords)
