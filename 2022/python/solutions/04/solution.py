def parse_input(input):
    return map(
        lambda line: map(
            lambda range: map(int, range.split('-')),
            line.split(',')
        ),
        input.splitlines()
    )


def part1(ranges):
    return sum(
        (l1 <= l2 and r1 >= r2) or (l2 <= l1 and r2 >= r1)
        for (l1, r1), (l2, r2) in ranges
    )


def part2(ranges):
    return sum(
        r1 >= l2 and r2 >= l1
        for (l1, r1), (l2, r2) in ranges
    )
