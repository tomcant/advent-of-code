from itertools import pairwise


def parse_input(input):
    return [pattern.splitlines() for pattern in input.split("\n\n")]


def part1(patterns):
    summary = 0

    for pattern in patterns:
        idx, vertical = find_reflection(pattern)
        summary += (idx + 1) if vertical else (idx + 1) * 100

    return summary


def part2(patterns):
    summary = 0
    flip = {".": "#", "#": "."}

    for pattern in patterns:
        smudged_reflection = find_reflection(pattern)
        found = False

        for y in range(len(pattern)):
            for x in range(len(pattern[y])):
                reflection = find_reflection(
                    [
                        (row[:x] + flip[row[x]] + row[x + 1 :]) if Y == y else row
                        for Y, row in enumerate(pattern)
                    ],
                    ignore=smudged_reflection,
                )

                if reflection:
                    idx, vertical = reflection
                    summary += (idx + 1) if vertical else (idx + 1) * 100
                    found = True
                    break

            if found:
                break

    return summary


def find_reflection(pattern, ignore=None):
    for vertical in [False, True]:
        if vertical:
            pattern = transpose(pattern)

        for idx, lines in enumerate(pairwise(pattern)):
            if lines[0] != lines[1] or (idx, vertical) == ignore:
                continue

            match = True
            i, j = idx, idx + 1

            while match and i >= 0 and j < len(pattern):
                match = pattern[i] == pattern[j]
                i, j = i - 1, j + 1

            if match:
                return (idx, vertical)

    return None


def transpose(pattern):
    return [
        "".join([pattern[j][i] for j in range(len(pattern))])
        for i in range(len(pattern[0]))
    ]
