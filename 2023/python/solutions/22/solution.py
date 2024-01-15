def parse_input(input):
    parsed = [
        [tuple(map(int, point.split(","))) for point in points]
        for points in [line.split("~") for line in input.splitlines()]
    ]

    bricks = []

    for start, end in parsed:
        dir = end[0] - start[0], end[1] - start[1], end[2] - start[2]
        x, y, z = (1, 0, 0) if dir[0] else (0, 1, 0) if dir[1] else (0, 0, 1)

        points = []
        point = start

        while point <= end:
            points.append(point)
            point = point[0] + x, point[1] + y, point[2] + z

        bricks.append((bool(z), sorted(points)))

    return bricks


def part1(bricks):
    grid = build_grid(bricks)
    simulate_fall(bricks, grid)

    count = 0

    for idx in range(len(bricks)):
        _, points = bricks[idx]
        new_grid = grid - set(points)
        new_bricks = [*bricks[:idx], *bricks[idx + 1 :]]
        fallen_bricks = simulate_fall(new_bricks, new_grid, True)

        if fallen_bricks == 0:
            count += 1

    return count


def part2(bricks):
    grid = build_grid(bricks)
    simulate_fall(bricks, grid)

    count = 0

    for idx in range(len(bricks)):
        _, points = bricks[idx]
        new_grid = grid - set(points)
        new_bricks = [*bricks[:idx], *bricks[idx + 1 :]]
        fallen_bricks = simulate_fall(new_bricks, new_grid)
        count += fallen_bricks

    return count


def simulate_fall(bricks, grid, return_on_fall=False):
    fallen_bricks = set()
    cube_will_fall = lambda x, y, z: z > 1 and (x, y, z - 1) not in grid

    while True:
        brick_fell = False

        for idx, (is_vertical, points) in enumerate(bricks):
            if is_vertical:
                brick_will_fall = cube_will_fall(*points[0])
            else:
                brick_will_fall = all(cube_will_fall(*point) for point in points)

            if brick_will_fall:
                brick_fell = True
                fallen_bricks.add(idx)

                new_points = [(x, y, z - 1) for x, y, z in points]
                bricks[idx] = (is_vertical, new_points)

                grid -= set(points)
                grid |= set(new_points)

        if not brick_fell or return_on_fall:
            break

    return len(fallen_bricks)


def build_grid(bricks):
    return {point for _, points in bricks for point in points}
