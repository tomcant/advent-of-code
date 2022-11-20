from re import match


def parse_input(input):
    regex = r'position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>'

    return [((x, y), (vx, vy))
            for x, y, vx, vy in [list(map(int, match(regex, line).groups()))
            for line in input.splitlines()]]


def part1(input):
    points, velocities = zip(*input)
    last_yrange = None
    last_points = []

    def move(idx_point):
        idx, (x, y) = idx_point
        vx, vy = velocities[idx]
        return x + vx, y + vy

    while True:
        points = list(map(move, enumerate(points)))
        (_, min_y), (_, max_y) = find_bounds(points)
        yrange = max_y - min_y

        if last_yrange and yrange > last_yrange:
            return '\n' + draw(last_points)

        last_yrange = yrange
        last_points = points


def part2(input):
    points, velocities = zip(*input)
    last_yrange = None
    seconds = 0

    def move(idx_point):
        idx, (x, y) = idx_point
        vx, vy = velocities[idx]
        return x + vx, y + vy

    while True:
        points = list(map(move, enumerate(points)))
        (_, min_y), (_, max_y) = find_bounds(points)
        yrange = max_y - min_y

        if last_yrange and yrange > last_yrange:
            return seconds

        last_yrange = yrange
        seconds += 1


def draw(points):
    point_set = set(points)
    (min_x, min_y), (max_x, max_y) = find_bounds(points)

    rows = [''.join('#' if (x, y) in point_set else '.'
            for x in range(min_x, max_x + 1)) for y in range(min_y, max_y + 1)]

    return '\n'.join(rows)


def find_bounds(points):
    xs = [x for x, _ in points]
    ys = [y for _, y in points]

    return (min(xs), min(ys)), (max(xs), max(ys))
