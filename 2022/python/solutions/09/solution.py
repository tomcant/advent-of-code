def parse_input(input):
    dirs = {
        'U': (0, -1),
        'D': (0, 1),
        'L': (-1, 0),
        'R': (1, 0),
    }

    def parse_line(line):
        dir, dist = line.split()
        return dirs[dir], int(dist)

    return map(parse_line, input.splitlines())


def part1(motions):
    return count_tail_positions(motions, tail_size=1)


def part2(motions):
    return count_tail_positions(motions, tail_size=9)


def count_tail_positions(motions, tail_size):
    positions = set([(0, 0)])
    knots = [(0, 0) for _ in range(tail_size + 1)]

    for (dx, dy), dist in motions:
        for _ in range(dist):
            knots[0] = knots[0][0] + dx, knots[0][1] + dy
            for i in range(1, len(knots)):
                knots[i] = next_knot_position(knots[i - 1], knots[i])
            positions.add(knots[-1])

    return len(positions)


def next_knot_position(head, tail):
    (hx, hy), (tx, ty) = head, tail
    dx, dy = abs(hx - tx), abs(hy - ty)

    if dx + dy == 4:
        return (hx + tx) / 2, (hy + ty) / 2

    if dx == 2:
        return hx + 1 if hx < tx else hx - 1, hy

    if dy == 2:
        return hx, hy + 1 if hy < ty else hy - 1

    return tail
