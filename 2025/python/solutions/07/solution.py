from collections import defaultdict


def parse_input(input):
    lines = input.splitlines()

    splitters = {
        (x, y)
        for y, row in enumerate(lines)
        for x, char in enumerate(row)
        if char == "^"
    }

    return splitters, lines[0].index("S"), len(lines)


def part1(input):
    splitters, start_x, height = input
    beams = {start_x}
    y = 0
    count = 0

    while len(beams) > 0 and y < height:
        new_beams = set()

        for x in beams:
            if (x, y) in splitters:
                count += 1
                new_beams.add(x - 1)
                new_beams.add(x + 1)
            else:
                new_beams.add(x)

        beams = new_beams
        y += 1

    return count


def part2(input):
    splitters, start_x, height = input
    beams = {start_x: 1}
    y = 0

    while len(beams) > 0 and y < height:
        new_beams = defaultdict(int)

        for x, count in beams.items():
            if (x, y) in splitters:
                new_beams[x - 1] += count
                new_beams[x + 1] += count
            else:
                new_beams[x] += count

        beams = new_beams
        y += 1

    return sum(beams.values())
