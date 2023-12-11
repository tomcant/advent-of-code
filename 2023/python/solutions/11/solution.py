from itertools import combinations


def parse_input(input):
    return {
        (x, y)
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
        if char != "."
    }


def part1(universe):
    pairs = combinations(expand_universe(universe, factor=2), r=2)
    return sum(manhattan_distance(pos1, pos2) for pos1, pos2 in pairs)


def part2(universe):
    pairs = combinations(expand_universe(universe, factor=1_000_000), r=2)
    return sum(manhattan_distance(pos1, pos2) for pos1, pos2 in pairs)


def expand_universe(universe, factor):
    max_x = max(x for x, _ in universe)
    max_y = max(y for _, y in universe)

    for x in reversed(range(max_x + 1)):
        if not any(x == X for X, _ in universe):
            universe = {(X, y) if X < x else (X + factor - 1, y) for X, y in universe}

    for y in reversed(range(max_y + 1)):
        if not any(y == Y for _, Y in universe):
            universe = {(x, Y) if Y < y else (x, Y + factor - 1) for x, Y in universe}

    return universe


def manhattan_distance(pos1, pos2):
    (x1, y1), (x2, y2) = pos1, pos2
    return abs(x2 - x1) + abs(y2 - y1)
