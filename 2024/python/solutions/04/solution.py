def parse_input(input):
    return {
        complex(x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
    }


def part1(grid):
    count = 0
    max_x = max(int(x.real) for x in grid)
    max_y = max(int(y.imag) for y in grid)

    DIRS = [1, 1j, -1, -1j, 1 + 1j, -1 + 1j, -1 - 1j, 1 - 1j]

    for y in range(max_y + 1):
        for x in range(max_x + 1):
            for dir in DIRS:
                pos = complex(x, y)
                for char in ("X", "M", "A", "S"):
                    if pos not in grid or grid[pos] != char:
                        break
                    pos += dir
                else:
                    count += 1

    return count


def part2(grid):
    count = 0
    max_x = max(int(x.real) for x in grid)
    max_y = max(int(y.imag) for y in grid)

    MMSS = [
        {1 + 1j: "S", -1 + 1j: "S", -1 - 1j: "M", 1 - 1j: "M"},
        {1 + 1j: "S", -1 + 1j: "M", -1 - 1j: "M", 1 - 1j: "S"},
        {1 + 1j: "M", -1 + 1j: "M", -1 - 1j: "S", 1 - 1j: "S"},
        {1 + 1j: "M", -1 + 1j: "S", -1 - 1j: "S", 1 - 1j: "M"},
    ]

    for y in range(1, max_y):
        for x in range(1, max_x):
            pos = complex(x, y)
            if grid[pos] != "A":
                continue

            for mmss in MMSS:
                for dir, char in mmss.items():
                    if grid[pos + dir] != char:
                        break
                else:
                    count += 1
                    break

    return count
