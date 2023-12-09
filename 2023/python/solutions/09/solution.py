from collections import Counter
from itertools import pairwise


def parse_input(input):
    return [list(map(int, line.split())) for line in input.splitlines()]


def part1(report):
    return sum(extrapolate(sequence) for sequence in report)


def part2(report):
    return sum(extrapolate(list(reversed(sequence))) for sequence in report)


def extrapolate(sequence):
    return sum(seq[-1] for seq in generate_diffs(sequence))


def generate_diffs(sequence):
    diffs = [sequence]

    while len(Counter(diffs[-1])) > 1:
        diffs.append([b - a for a, b in pairwise(diffs[-1])])

    return diffs
