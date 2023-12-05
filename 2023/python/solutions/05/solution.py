from itertools import batched
from re import findall


def parse_input(input):
    seeds, *rest = input.split("\n\n")
    seeds = map(int, findall(r"\d+", seeds))
    converters = {}

    for lines in rest:
        name, *ranges = lines.splitlines()
        [(source, dest)] = findall(r"(.+)-to-(.+)\s", name)
        converters[source] = dest, [list(map(int, range.split())) for range in ranges]

    return seeds, converters


def part1(input):
    seeds, converters = input
    return min(convert_seed_to_location(seed, converters) for seed in seeds)


def part2(input):
    seeds, converters = input

    return min(
        convert_seed_to_location(seed, converters)
        for start, size in batched(seeds, n=2)
        for seed in range(start, start + size)
    )


def convert_seed_to_location(seed, converters):
    val, category = seed, "seed"

    while category != "location":
        category, ranges = converters[category]
        val = convert_source_to_dest(val, ranges)

    return val


def convert_source_to_dest(val, ranges):
    for dest, source, size in ranges:
        if source <= val < source + size:
            return dest + val - source

    return val
