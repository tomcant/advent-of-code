def parse_input(input):
    start = end = None
    map = []

    for y, line in enumerate(input.splitlines()):
        row = []
        for x, elevation in enumerate(line):
            match elevation:
                case 'S':
                    start = x, y
                    elevation = 'a'
                case 'E':
                    end = x, y
                    elevation = 'z'
            row.append(ord(elevation))
        map.append(row)

    return start, end, map


def part1(input):
    start, end, map = input
    return find_fewest_steps(start, end, map)


def part2(input):
    (start_x, start_y), end, map = input

    start_positions = [
        (x, y)
        for y, row in enumerate(map)
        for x, elevation in enumerate(row)
        if elevation == map[start_y][start_x]
    ]

    return min(
        filter(
            lambda steps: steps is not None,
            [find_fewest_steps(start, end, map) for start in start_positions]
        )
    )


def find_fewest_steps(start, end, map):
    queue = [(start, 0)]
    history = set()

    while len(queue) > 0:
        pos, depth = queue.pop(0)
        if pos in history:
            continue
        history.add(pos)
        if pos == end:
            return depth
        for neighbour in get_neighbours(pos, map):
            queue.append((neighbour, depth + 1))


def get_neighbours(pos, map):
    neighbours = []
    x, y = pos
    height = len(map)
    width = len(map[0])
    max_elevation = map[y][x] + 1

    if x+1 < width and map[y][x+1] <= max_elevation:
        neighbours.append((x+1, y))

    if x > 0 and map[y][x-1] <= max_elevation:
        neighbours.append((x-1, y))

    if y+1 < height and map[y+1][x] <= max_elevation:
        neighbours.append((x, y+1))

    if y > 0 and map[y-1][x] <= max_elevation:
        neighbours.append((x, y-1))

    return neighbours
