from collections import defaultdict
from re import findall


def parse_input(input):
    return [tuple(map(int, findall(r'\d+', line))) for line in input.splitlines()]


def part1(claims):
    return len(find_overlapping_points(claims))


def part2(claims):
    overlapping_points = find_overlapping_points(claims)

    for claim in claims:
        if not any([point in overlapping_points for point in all_points(claim)]):
            id, *_ = claim
            return id


def find_overlapping_points(claims):
    points = defaultdict(int)

    for claim in claims:
        for point in all_points(claim):
            points[point] += 1

    return set([point for point, freq in points.items() if freq > 1])


def all_points(claim):
    _, x, y, w, h = claim

    for i in range(x + 1, x + 1 + w):
        for j in range(y + 1, y + 1 + h):
            yield i, j
