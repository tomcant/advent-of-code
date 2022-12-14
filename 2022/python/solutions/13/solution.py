from functools import cmp_to_key


def parse_input(input):
    return map(lambda pair: map(eval, pair.splitlines()), input.split('\n\n'))


def part1(pairs):
    return sum(idx for idx, (left, right) in enumerate(pairs, 1) if compare(left, right) < 0)


def part2(pairs):
    dividers = [[[2]], [[6]]]

    packets = [*dividers, *[packet for pair in pairs for packet in pair]]
    packets.sort(key=cmp_to_key(compare))

    return (packets.index(dividers[0]) + 1) * (packets.index(dividers[1]) + 1)


def compare(left, right):
    match (type(left) == int, type(right) == int):
        case True, True: return left - right
        case True, False: return compare([left], right)
        case False, True: return compare(left, [right])

    for l, r in zip(left, right):
        if (cmp := compare(l, r)) != 0:
            return cmp

    return len(left) - len(right)
