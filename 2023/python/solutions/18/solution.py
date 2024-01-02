from itertools import pairwise


def parse_input(input):
    return [line.split() for line in input.splitlines()]


# We're looking for the total area occupied by the polygon given in the dig
# plan. Part 1 can be solved trivially by collecting the coordinates of the
# polygon's boundary and using a BFS flood fill to find its area. The input
# for part 2 yields a much larger polygon and this approach won't finish in
# a timely fashion, so we can use a combination of the Shoelace formula and
# Pick's theorem to calculate the area instead.
#
# Pick's theorem states that A = i + b/2 - 1, where A is the area, i is the
# number of internal integer points and b is the number of boundary integer
# points. However, this is not the area we want because it does not include
# the boundary itself. So if we use the Shoelace formula to find A instead,
# we can rearrange Pick's theorem to find the number of internal points and
# simply add this to the number of boundary points, which is the sum of the
# x/y differences between consecutive vertices.
#
# i.e. from Pick's:
#   A = i + b/2 - 1  =>  i = A - b/2 + 1
#
# Adding the number of boundary points to both sides gives:
#   i + b = A + b/2 + 1
#
# https://en.wikipedia.org/wiki/Shoelace_formula
# https://en.wikipedia.org/wiki/Pick%27s_theorem


def part1(dig_plan):
    pos = start_pos = 0
    grid = set([start_pos])

    for dir, dist, _ in dig_plan:
        for _ in range(int(dist)):
            pos += DIRS[dir]
            grid.add(pos)

    min_x = int(min(x.real for x in grid)) - 1
    min_y = int(min(x.imag for x in grid)) - 1
    max_x = int(max(x.real for x in grid)) + 1
    max_y = int(max(x.imag for x in grid)) + 1

    queue = [complex(min_x, min_y)]
    outside = set()

    while len(queue) > 0:
        pos = queue.pop()

        if pos in outside:
            continue

        outside.add(pos)

        for dir in DIRS:
            neighbour = pos + DIRS[dir]
            if neighbour in grid:
                continue
            if not min_x <= neighbour.real <= max_x:
                continue
            if not min_y <= neighbour.imag <= max_y:
                continue
            queue.append(neighbour)

    width = max_x - min_x + 1
    height = max_y - min_y + 1

    return width * height - len(outside)


def part2(dig_plan):
    pos = start_pos = 0
    vertices = [start_pos]
    perimeter = 0

    dir_lookup = {"0": "R", "1": "D", "2": "L", "3": "U"}

    for *_, (_, _, *dist, dir, _) in dig_plan:
        dist = int("".join(dist), 16)
        pos += dist * DIRS[dir_lookup[dir]]
        vertices.append(pos)
        perimeter += dist

    # Shoelace formula
    internal_area = 0
    for p1, p2 in pairwise(vertices):
        a, b, c, d = p1.real, p2.real, p1.imag, p2.imag
        internal_area += (a * d - b * c) / 2

    # Rearranged Pick's theorem
    return int(internal_area + perimeter / 2 + 1)


DIRS = {
    "R": 1,
    "D": 1j,
    "L": -1,
    "U": -1j,
}
