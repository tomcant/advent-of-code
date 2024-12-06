def parse_input(input):
    start = None
    obstacles = set()

    for y, line in enumerate(input.splitlines()):
        for x, char in enumerate(line):
            match char:
                case "#":
                    obstacles.add(complex(x, y))
                case "^":
                    start = complex(x, y)

    return start, obstacles


def part1(input):
    start, obstacles = input
    return len(follow_path(start, obstacles))


def part2(input):
    start, obstacles = input

    return sum(
        1 if path_contains_loop(start, set([*obstacles, pos])) else 0
        for pos in follow_path(start, obstacles)
    )


def follow_path(start, obstacles):
    pos = start
    dir = -1j
    path = set([start])

    max_x = max(o.real for o in obstacles)
    max_y = max(o.imag for o in obstacles)

    while True:
        if pos + dir in obstacles:
            dir *= 1j
            continue

        pos += dir
        if not (0 <= pos.real <= max_x and 0 <= pos.imag <= max_y):
            break

        path.add(pos)

    return path


def path_contains_loop(start, obstacles):
    pos = start
    dir = -1j
    path = set([start])

    max_x = max(o.real for o in obstacles)
    max_y = max(o.imag for o in obstacles)

    while True:
        if pos + dir in obstacles:
            dir *= 1j
            continue

        pos += dir
        if not (0 <= pos.real <= max_x and 0 <= pos.imag <= max_y):
            return False

        if (pos, dir) in path:
            return True

        path.add((pos, dir))
