def parse_input(input):
    ranges, ingredients = input.split("\n\n")
    ranges = [tuple(map(int, range.split("-"))) for range in ranges.splitlines()]
    ingredients = map(int, ingredients.splitlines())
    return ranges, ingredients


def part1(input):
    ranges, ingredients = input
    fresh_ingredients = 0

    for ingredient in ingredients:
        for r1, r2 in ranges:
            if r1 <= ingredient <= r2:
                fresh_ingredients += 1
                break

    return fresh_ingredients


def part2(input):
    ranges, _ = input
    ranges = sorted(ranges)

    fresh_ingredients = 0
    last_r2 = 0

    for r1, r2 in ranges:
        if r1 <= last_r2:
            r1 = last_r2 + 1
        if r1 > r2:
            continue
        fresh_ingredients += r2 - r1 + 1
        last_r2 = r2

    return fresh_ingredients
