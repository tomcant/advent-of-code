def parse_input(input):
    return zip(*[map(int, line.split()) for line in input.splitlines()])


def part1(input):
    return sum(abs(left - right) for left, right in zip(*map(sorted, input)))


def part2(input):
    left, right = input
    return sum(n * right.count(n) for n in left)
