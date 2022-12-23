from collections import Counter
from itertools import islice


def parse_input(input):
    return set(
        (x, y)
        for y, row in enumerate(input.splitlines())
        for x, tile in enumerate(row)
        if tile == '#'
    )


def part1(elves):
    round10 = next(islice(simulate(elves), 9, None))
    xs, ys = [x for x, _ in round10], [y for _, y in round10]
    width, height = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
    empty_tiles = width * height - len(elves)

    return empty_tiles


def part2(elves):
    return len(list(simulate(elves))) + 1


def simulate(elves):
    dirs = [
        [(-1, -1), (0, -1), (1, -1)],  # N nopep8
        [(-1,  1), (0,  1), (1,  1)],  # S nopep8
        [(-1, -1), (-1, 0), (-1, 1)],  # W nopep8
        [(1,  -1), (1,  0), (1,  1)],  # E nopep8
    ]

    round = 1

    while True:
        next_elves = []
        proposals = {}

        for pos in elves:
            if not any(neighbour in elves for neighbour in neighbours(pos)):
                next_elves.append(pos)
                continue

            x, y = pos

            for i in range(len(dirs)):
                dirs_to_check = dirs[(round - 1 + i) % len(dirs)]

                if all((x + dx, y + dy) not in elves for dx, dy in dirs_to_check):
                    _, (dx, dy), _ = dirs_to_check
                    proposals[pos] = x + dx, y + dy
                    break
            else:
                next_elves.append(pos)

        if not proposals:
            return

        proposed_tiles = Counter(pos for pos in proposals.values())

        for (x, y), (nx, ny) in proposals.items():
            next_elves.append((x, y) if proposed_tiles[(nx, ny)] > 1 else (nx, ny))

        yield next_elves

        elves = set(next_elves)
        round += 1


def neighbours(pos):
    for dx, dy in [
        (-1, -1), (0, -1), (1, -1),  # nopep8
        (-1,  0),          (1,  0),  # nopep8
        (-1,  1), (0,  1), (1,  1),  # nopep8
    ]:
        yield pos[0] + dx, pos[1] + dy
