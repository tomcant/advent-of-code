from collections import deque


def parse_input(input):
    return set(map(lambda line: tuple(map(int, line.split(','))), input.splitlines()))


def part1(cubes):
    return sum(pos not in cubes for cube in cubes for pos in get_neighbours(cube))


def part2(cubes):
    min, *_, max = sorted(cubes)

    outside = [
        (min[0] - 1, min[1] - 1, min[2] - 1),
        (max[0] + 1, max[1] + 1, max[2] + 1),
    ]

    in_cache = set()
    out_cache = set()

    def is_outside(pos):
        if pos in out_cache: return True
        if pos in in_cache: return False

        queue = deque([pos])
        seen = set()

        while queue:
            pos = queue.popleft()
            if pos in seen or pos in cubes:
                continue
            seen.add(pos)
            if pos in outside:
                out_cache.update(seen)
                return True
            queue += get_neighbours(pos)

        in_cache.update(seen)
        return False

    return sum(is_outside(pos) for cube in cubes for pos in get_neighbours(cube))


def get_neighbours(pos):
    return [(pos[0] + dx, pos[1] + dy, pos[2] + dz) for dx, dy, dz in DIRS]


DIRS = [
    (1, 0, 0),
    (-1, 0, 0),
    (0, 1, 0),
    (0, -1, 0),
    (0, 0, 1),
    (0, 0, -1),
]
