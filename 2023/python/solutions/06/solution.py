from math import prod
from re import findall


def part1(input):
    races = zip(*[map(int, findall(r"\d+", line)) for line in input.splitlines()])
    return prod(count_winning_scenarios(*race) for race in races)


def part2(input):
    race = [int("".join(findall(r"\d+", line))) for line in input.splitlines()]
    return count_winning_scenarios(*race)


def count_winning_scenarios(time_limit, time_to_beat):
    return sum(
        1 if time * (time_limit - time) > time_to_beat else 0
        for time in range(1, time_limit)
    )
