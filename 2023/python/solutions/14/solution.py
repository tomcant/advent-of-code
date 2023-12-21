def parse_input(input):
    return {
        (x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
    }


def part1(platform):
    return calculate_load(tilt(platform, (0, -1)))


def part2(platform):
    seen = []
    dir_idx = 0

    DIRS = [(0, -1), (-1, 0), (0, 1), (1, 0)]

    while True:
        platform = tilt(platform, DIRS[dir_idx % 4])

        if platform in seen:
            break

        seen.append(dict(platform))
        dir_idx += 1

    loop_start_idx = seen.index(platform)
    loop = seen[loop_start_idx:]

    platform_after_billionth_cycle = loop[4_000_000_000 % len(loop) - loop_start_idx - 1]

    return calculate_load(platform_after_billionth_cycle)


def calculate_load(platform):
    max_y = max(y for _, y in platform)
    return sum(max_y + 1 - y for (_, y), char in platform.items() if char == "O")


def tilt(platform, dir):
    while True:
        moved = False
        rocks = [pos for pos, char in platform.items() if char == "O"]

        for x, y in rocks:
            next = x + dir[0], y + dir[1]

            while next in platform and platform[next] == ".":
                moved = True

                platform[x, y] = "."
                platform[next] = "O"

                x, y = next
                next = next[0] + dir[0], next[1] + dir[1]

        if not moved:
            break

    return platform
