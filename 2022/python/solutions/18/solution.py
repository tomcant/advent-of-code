from collections import deque


def parse_input(input):
    return set(map(lambda line: tuple(map(int, line.split(','))), input.splitlines()))


def part1(cubes):
    return sum(pos not in cubes for cube in cubes for pos in get_neighbours(cube))


def part2(cubes):
    cache = {}
    min, *_ = sorted(cubes)
    outside = min[0] - 1, min[1] - 1, min[2] - 1

    def is_outside(pos):
        if pos in cache:
            return cache[pos]

        queue = deque([pos])
        seen = set()

        while queue:
            pos = queue.popleft()
            if pos in seen or pos in cubes:
                continue
            seen.add(pos)
            if pos == outside:
                cache.update((pos, True) for pos in seen)
                return True
            queue += get_neighbours(pos)

        cache.update((pos, False) for pos in seen)
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
