from collections import deque


def parse_input(input):
    grid = {
        (x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
    }

    for pos in grid:
        if grid[pos] == "S":
            start_pos = pos
            break

    grid[start_pos] = determine_pipe(grid, start_pos)

    return grid, start_pos


def part1(input):
    grid, start_pos = input
    queue = deque([{"pos": start_pos, "steps": 0}])
    visited = set()

    while queue:
        item = queue.popleft()
        pos = item["pos"]

        if pos in visited:
            return item["steps"]

        visited.add(pos)

        for neighbour in neighbours(pos):
            if neighbour not in grid or neighbour in visited:
                continue

            if connects(pos, neighbour, grid):
                queue.append({"pos": neighbour, "steps": item["steps"] + 1})


def part2(input):
    grid, start_pos = input
    pipe_maze = find_pipe_maze(grid, start_pos)

    grid_without_extra_pipes = {
        pos: grid[pos] if pos in pipe_maze else "." for pos in grid
    }

    enlarged_grid = enlarge_grid(grid_without_extra_pipes)
    outer_tiles = find_outer_tiles(enlarged_grid)

    return sum(
        1 if grid_without_extra_pipes[pos] == "." else 0
        for pos in {(x // 3, y // 3) for x, y in enlarged_grid.keys() - outer_tiles}
    )


def enlarge_grid(grid):
    enlarged_grid = {}

    tiles = {
        "-": "...\n###\n...",
        "|": ".#.\n.#.\n.#.",
        "F": "...\n.##\n.#.",
        "L": ".#.\n.##\n...",
        "7": "...\n##.\n.#.",
        "J": ".#.\n##.\n...",
        ".": "...\n...\n...",
    }

    for (x, y), tile in grid.items():
        enlarged_grid.update(
            {
                (3 * x + nx, 3 * y + ny): char
                for ny, row in enumerate(tiles[tile].splitlines())
                for nx, char in enumerate(row)
            }
        )

    return enlarged_grid


def find_pipe_maze(grid, start_pos):
    pipes = set()
    queue = deque([start_pos])

    while queue:
        pos = queue.popleft()

        if pos in pipes:
            continue

        pipes.add(pos)

        for neighbour in neighbours(pos):
            if neighbour in grid and connects(pos, neighbour, grid):
                queue.append(neighbour)

    return pipes


def find_outer_tiles(grid):
    outer = set()
    queue = deque([(0, 0)])

    while queue:
        pos = queue.popleft()

        if pos in outer:
            continue

        outer.add(pos)

        for neighbour in neighbours(pos):
            if neighbour in grid and grid[neighbour] == ".":
                queue.append(neighbour)

    return outer


def connects(pos1, pos2, grid):
    return points_at(pos1, pos2, grid) and points_at(pos2, pos1, grid)


def points_at(pos1, pos2, grid):
    (x1, y1), (x2, y2) = pos1, pos2

    match grid[pos2]:
        case "|":
            return x1 == x2
        case "-":
            return y1 == y2
        case "J":
            return (y1 == y2 and x1 < x2) or (x1 == x2 and y1 < y2)
        case "7":
            return (y1 == y2 and x1 < x2) or (x1 == x2 and y1 > y2)
        case "L":
            return (y1 == y2 and x1 > x2) or (x1 == x2 and y1 < y2)
        case "F":
            return (y1 == y2 and x1 > x2) or (x1 == x2 and y1 > y2)


def determine_pipe(grid, pos):
    connecting_neighbour_idxs = [
        idx
        for idx, (x, y) in enumerate(neighbours(pos))
        if x >= 0 and y >= 0 and points_at(pos, (x, y), grid)
    ]

    assert len(connecting_neighbour_idxs) == 2

    match connecting_neighbour_idxs:
        case [0, 1]:
            return "J"
        case [0, 2]:
            return "L"
        case [0, 3]:
            return "|"
        case [1, 2]:
            return "-"
        case [1, 3]:
            return "7"
        case [2, 3]:
            return "F"


def neighbours(pos):
    for dx, dy in [
        (0, -1),
        (-1, 0),
        (1, 0),
        (0, 1),
    ]:
        yield pos[0] + dx, pos[1] + dy
