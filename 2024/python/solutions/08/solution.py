from collections import defaultdict
from itertools import combinations, count


def parse_input(input):
    locations_by_antenna = defaultdict(set)

    for y, line in enumerate(input.splitlines()):
        for x, char in enumerate(line):
            if char != ".":
                locations_by_antenna[char].add((y, x))

    return locations_by_antenna, (y, x)


def part1(input):
    locations_by_antenna, (max_y, max_x) = input
    antinode_locations = set()

    for locations in locations_by_antenna.values():
        for (y1, x1), (y2, x2) in combinations(sorted(locations), 2):
            dy, dx = y2 - y1, x2 - x1
            for py, px in (y1 - dy, x1 - dx), (y2 + dy, x2 + dx):
                if 0 <= py <= max_y and 0 <= px <= max_x:
                    antinode_locations.add((py, px))

    return len(antinode_locations)


def part2(input):
    locations_by_antenna, (max_y, max_x) = input
    antinode_locations = set()

    for locations in locations_by_antenna.values():
        for (y1, x1), (y2, x2) in combinations(sorted(locations), 2):
            dy, dx = y2 - y1, x2 - x1
            for dir, (y, x) in (-1, (y1, x1)), (+1, (y2, x2)):
                for n in count(start=0, step=1):
                    py, px = y + n * dir * dy, x + n * dir * dx
                    if 0 <= py <= max_y and 0 <= px <= max_x:
                        antinode_locations.add((py, px))
                    else:
                        break

    return len(antinode_locations)
