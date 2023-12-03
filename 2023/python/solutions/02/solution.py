from collections import defaultdict
from math import prod
from re import findall


def parse_input(input):
    games = []

    for line in input.splitlines():
        bag = defaultdict(int)

        for number, colour in findall(r"(\d+) (\w+)", line):
            bag[colour] = max(int(number), bag[colour])

        games.append(bag)

    return games


def part1(games):
    return sum(
        idx + 1
        for idx, bag in enumerate(games)
        if bag["red"] <= 12 and bag["green"] <= 13 and bag["blue"] <= 14
    )


def part2(games):
    return sum(prod(game.values()) for game in games)
