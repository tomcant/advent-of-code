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
            grid[pos] = "."
            break

    return grid, start_pos


def part1(input):
    grid, start_pos = input
    return count_reachable_plots(grid, start_pos, step_target=64)


def part2(input):
    grid, start_pos = input
    step_target = 26501365
    width, height = get_grid_size(grid)
    initial_steps = width // 2

    assert width == height
    assert (step_target - initial_steps) % (width + height) == 0
    assert all("." == grid[(x, height // 2)] for x in range(width))
    assert all("." == grid[(width // 2, y)] for y in range(height))

    # fmt: off
    plots_1 = count_reachable_plots(grid, start_pos, step_target=initial_steps)
    plots_2 = count_reachable_plots(grid, start_pos, step_target=initial_steps + width + height)
    plots_3 = count_reachable_plots(grid, start_pos, step_target=initial_steps + (width + height) * 2)
    # fmt: on

    plots_diff_1 = plots_2 - plots_1
    plots_diff_2 = plots_3 - plots_2

    plots_diff = plots_diff_2 - plots_diff_1

    steps = initial_steps
    plots = plots_1
    plots_inc = plots_diff_1

    while steps < step_target:
        steps += width + height
        plots += plots_inc
        plots_inc += plots_diff

    return plots


def count_reachable_plots(grid, start_pos, step_target):
    plots = 0
    width, height = get_grid_size(grid)
    queue = deque([(start_pos, 0)])
    seen = set()

    DIRS = [(0, -1), (-1, 0), (0, 1), (1, 0)]

    while len(queue) > 0:
        pos, steps = queue.popleft()

        if pos in seen:
            continue

        seen.add(pos)

        if steps % 2 == step_target % 2:
            plots += 1

        if steps == step_target:
            continue

        for dir in DIRS:
            new_pos = (pos[0] + dir[0]) % width, (pos[1] + dir[1]) % height

            if grid[new_pos] == ".":
                queue.append(((pos[0] + dir[0], pos[1] + dir[1]), steps + 1))

    return plots


def get_grid_size(grid):
    width = max(x for x, _ in grid) + 1
    height = max(y for _, y in grid) + 1

    return width, height
