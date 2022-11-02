def parse_input(input):
    return [int(n) for n in input.splitlines()]


def part1(diffs):
    return sum(diffs)


def part2(diffs):
    current, seen = 0, {0}

    while True:
        for diff in diffs:
            current += diff
            if current in seen:
                return current
            seen.add(current)
