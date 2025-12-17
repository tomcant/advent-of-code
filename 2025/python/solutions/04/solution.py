def parse_input(input):
    return {
        complex(x, y)
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
        if char == "@"
    }


def part1(grid):
    return sum(1 for pos in grid if is_removable(pos, grid))


def part2(grid):
    new_grid = grid

    while True:
        size = len(new_grid)
        new_grid = {pos for pos in new_grid if not is_removable(pos, new_grid)}

        if len(new_grid) == size:
            break

    return len(grid) - len(new_grid)


def is_removable(pos, grid):
    DIRS = [1, 1j, -1, -1j, 1 + 1j, -1 + 1j, -1 - 1j, 1 - 1j]
    blockers = 0

    for dir in DIRS:
        if pos + dir in grid:
            blockers += 1
            if blockers > 3:
                return False

    return True
