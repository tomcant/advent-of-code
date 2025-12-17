def parse_input(input):
    return [list(map(int, line)) for line in input.splitlines()]


def part1(banks):
    return sum(max_joltage_for_bank(bank, 2) for bank in banks)


def part2(banks):
    return sum(max_joltage_for_bank(bank, 12) for bank in banks)


def max_joltage_for_bank(bank, num_batteries):
    stack = []
    skips_left = len(bank) - num_batteries

    for digit in bank:
        while len(stack) > 0 and skips_left > 0 and digit > stack[-1]:
            skips_left -= 1
            stack.pop()

        stack.append(digit)

    return int("".join(map(str, stack[:num_batteries])))
