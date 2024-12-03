from re import findall


def part1(input):
    return sum_multiplications(input)


def part2(input):
    sum = 0

    for idx, chunk in enumerate(input.split("don't()")):
        do_idx = chunk.find("do()") if idx != 0 else 0
        sum += sum_multiplications(chunk[do_idx:])

    return sum


def sum_multiplications(string):
    return sum(int(l) * int(r) for l, r in findall(r"mul\((\d+),(\d+)\)", string))
