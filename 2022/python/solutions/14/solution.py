from itertools import pairwise


def parse_input(input):
    walls = map(
        lambda line: pairwise(
            map(
                lambda path: tuple(map(int, path.split(','))),
                line.split('->')
            )
        ),
        input.splitlines()
    )

    cave = set()

    for wall in walls:
        for (x1, y1), (x2, y2) in wall:
            if x1 == x2:
                dx, dy = (0, 1) if y2 > y1 else (0, -1)
            else:
                dx, dy = (1, 0) if x2 > x1 else (-1, 0)

            cave.add((x1, y1))
            while (x1, y1) != (x2, y2):
                x1, y1 = x1 + dx, y1 + dy
                cave.add((x1, y1))

    return cave


def part1(cave):
    sand = 0
    ymax = max(y for _, y in cave)

    while True:
        x, y = 500, 0

        while True:
            for nx in [x, x-1, x+1]:
                if (nx, y+1) not in cave:
                    x, y = nx, y+1
                    break
            else:
                cave.add((x, y))
                sand += 1
                break

            if y == ymax:
                return sand


def part2(cave):
    sand = 0
    start = 500, 0

    ymax = max(y for _, y in cave) + 2
    xs = [x for x, _ in cave]

    cave.update(map(
        lambda x: (x, ymax),
        range(min(xs)-ymax, max(xs)+ymax)
    ))

    while start not in cave:
        x, y = start

        while y < ymax:
            for nx in [x, x-1, x+1]:
                if (nx, y+1) not in cave:
                    x, y = nx, y+1
                    break
            else:
                cave.add((x, y))
                sand += 1
                break

    return sand
