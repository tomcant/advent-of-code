def parse_input(input):
    return [
        int(line.replace("L", "-").replace("R", "+")) for line in input.splitlines()
    ]


def part1(input):
    dial, count = 50, 0

    for dist in input:
        dial += dist
        dial %= 100
        if dial == 0:
            count += 1

    return count


def part2(input):
    dial, count = 50, 0

    for dist in input:
        dir = 1 if dist > 0 else -1
        for _ in range(abs(dist)):
            dial += dir
            dial %= 100
            if dial == 0:
                count += 1

    return count
