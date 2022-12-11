def parse_input(input):
    return list(map(lambda line: list(map(int, line)), input.splitlines()))


def part1(trees):
    return len(find_visible_trees(trees))


def part2(trees):
    return max(calc_scenic_score(x, y, trees) for x, y in find_visible_trees(trees))


def find_visible_trees(trees):
    assert (len(trees) == len(trees[0]))

    visible = set()
    size = len(trees)

    for y in range(size):
        for xs in [range(size), reversed(range(size))]:
            tallest_x, tallest_y = 0, 0
            for x in xs:
                if x in [0, size-1] or trees[y][x] > tallest_x:
                    tallest_x = max(tallest_x, trees[y][x])
                    visible.add((x, y))
                if x in [0, size-1] or trees[x][y] > tallest_y:
                    tallest_y = max(tallest_y, trees[x][y])
                    visible.add((y, x))

    return list(visible)


def calc_scenic_score(x, y, trees):
    assert (len(trees) == len(trees[0]))

    scenic_score = 1
    size = len(trees)

    for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        distance = 0
        nx, ny = x, y

        while True:
            nx, ny = nx + dx, ny + dy
            if not (0 <= nx < size and 0 <= ny < size):
                break
            distance += 1
            if trees[ny][nx] >= trees[y][x]:
                break

        scenic_score *= distance

    return scenic_score
