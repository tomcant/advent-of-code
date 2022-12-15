from re import findall


def parse_input(input):
    return [tuple(map(int, findall(r'-?\d+', line))) for line in input.splitlines()]


def part1(sensors):
    y = 2_000_000
    segments = []
    beacons = set()

    for sx, sy, bx, by in sensors:
        if by == y:
            beacons.add((bx, by))

        dist_to_beacon = abs(sx - bx) + abs(sy - by)
        dist_to_y = abs(y - sy)

        if (dx := dist_to_beacon - dist_to_y) >= 0:
            segments.append((sx - dx, sx + dx))

    return len(set().union(*[range(x1, x2 + 1) for x1, x2 in segments])) - len(beacons)


def part2(sensors):
    ymax = 4_000_000

    for y in range(ymax + 1):
        segments = []

        for sx, sy, bx, by in sensors:
            dist_to_beacon = abs(sx - bx) + abs(sy - by)
            dist_to_y = abs(y - sy)

            if (dx := dist_to_beacon - dist_to_y) >= 0:
                segments.append((sx - dx, sx + dx))

        segments.sort()
        (_, last_x2), *_ = segments

        for x1, x2 in segments[1:]:
            if last_x2 < x1:
                return (x1 - 1) * ymax + y
            last_x2 = max(last_x2, x2)
