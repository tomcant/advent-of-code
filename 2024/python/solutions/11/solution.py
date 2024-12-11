from functools import cache


def parse_input(input):
    return map(int, input.split())


def part1(stones):
    return sum(count(stone, num_blinks=25) for stone in stones)


def part2(stones):
    return sum(count(stone, num_blinks=75) for stone in stones)


@cache
def count(stone, num_blinks):
    if num_blinks == 0:
        return 1

    if stone == 0:
        return count(1, num_blinks - 1)

    if len(str(stone)) % 2 == 0:
        D = 10 ** (len(str(stone)) // 2)
        return count(stone // D, num_blinks - 1) + count(stone % D, num_blinks - 1)

    return count(stone * 2024, num_blinks - 1)
