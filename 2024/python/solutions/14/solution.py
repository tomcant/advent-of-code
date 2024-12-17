from itertools import count
from re import findall


WIDTH = 101
HEIGHT = 103


def parse_input(input):
    return [list(map(int, findall(r"-?\d+", line))) for line in input.splitlines()]


def part1(robots):
    half_width = (WIDTH - 1) // 2
    half_height = (HEIGHT - 1) // 2

    q1, q2, q3, q4 = 0, 0, 0, 0

    for px, py, vx, vy in robots:
        nx = (px + vx * 100) % WIDTH
        ny = (py + vy * 100) % HEIGHT

        if nx == half_width or ny == half_height:
            continue

        if nx < half_width:
            if ny < half_height:
                q1 += 1
            else:
                q3 += 1
        else:
            if ny < half_height:
                q2 += 1
            else:
                q4 += 1

    return q1 * q2 * q3 * q4


def part2(robots):
    for iterations in count(start=1, step=1):
        final_positions = set()

        for px, py, vx, vy in robots:
            nx = (px + vx * iterations) % WIDTH
            ny = (py + vy * iterations) % HEIGHT
            final_positions.add((nx, ny))

        if len(final_positions) == len(robots):
            draw(final_positions)
            return iterations


def draw(robots):
    print(
        "\n".join(
            "".join("#" if (x, y) in robots else "." for x in range(WIDTH))
            for y in range(HEIGHT)
        )
    )
