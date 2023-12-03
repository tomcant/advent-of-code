def parse_input(input):
    grid = {
        (x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
        if char != "."
    }

    digits = {pos: val for pos, val in grid.items() if val.isdigit()}
    symbols = {pos: val for pos, val in grid.items() if pos not in digits}

    numbers = {}

    for (x, y), digit in digits.items():
        number = digit

        x_right = x + 1
        while (x_right, y) in digits:
            number += digits[(x_right, y)]
            x_right += 1

        x_left = x - 1
        while (x_left, y) in digits:
            number = digits[(x_left, y)] + number
            x_left -= 1

        numbers[(x, y)] = {"number": int(number), "id": (x_left, y)}

    return numbers, symbols


def part1(input):
    numbers, symbols = input
    part_numbers = {}

    for pos in symbols:
        for neighbour in neighbours(pos):
            if neighbour in numbers:
                part_numbers[numbers[neighbour]["id"]] = numbers[neighbour]["number"]

    return sum(part_numbers.values())


def part2(input):
    numbers, symbols = input
    gear_ratios = []

    for pos, symbol in symbols.items():
        if symbol != "*":
            continue

        ratio = 1
        part_numbers = set()

        for neighbour in neighbours(pos):
            if neighbour in numbers and numbers[neighbour]["id"] not in part_numbers:
                part_numbers.add(numbers[neighbour]["id"])
                ratio *= numbers[neighbour]["number"]

        if len(part_numbers) == 2:
            gear_ratios.append(ratio)

    return sum(gear_ratios)


def neighbours(pos):
    for dx, dy in [
        (-1, -1),
        (0, -1),
        (1, -1),
        (-1, 0),
        (1, 0),
        (-1, 1),
        (0, 1),
        (1, 1),
    ]:
        yield pos[0] + dx, pos[1] + dy
