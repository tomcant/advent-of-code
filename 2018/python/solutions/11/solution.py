from math import floor


def parse_input(input):
    def calc_power_level(x, y, serial_num):
        rack_id = x + 10
        return floor((rack_id * y + serial_num) * rack_id / 100) % 10 - 5

    return [[calc_power_level(x, y, int(input))
            for x in range(1, 301)] for y in range(1, 301)]


def part1(grid):
    square_pos = None
    max_power = 0
    sum_table = build_sum_table(grid)

    for y in range(1, len(grid) - 2):
        for x in range(1, len(grid[y]) - 2):
            power = sum_table[y+2][x+2] \
                - sum_table[y+2][x-1] \
                - sum_table[y-1][x+2] \
                + sum_table[y-1][x-1]

            if power > max_power:
                max_power = power
                square_pos = x + 1, y + 1

    return square_pos


def part2(grid):
    square_pos = None
    square_size = None
    max_power = 0
    sum_table = build_sum_table(grid)

    for y in range(1, len(grid)):
        for x in range(1, len(grid[y])):
            for size in range(1, min(len(grid[y]) - x, len(grid) - y) + 1):
                power = sum_table[y+size-1][x+size-1] \
                    - sum_table[y+size-1][x-1] \
                    - sum_table[y-1][x+size-1] \
                    + sum_table[y-1][x-1]

                if power > max_power:
                    max_power = power
                    square_pos = x + 1, y + 1
                    square_size = size

    return square_pos, square_size


# https://en.wikipedia.org/wiki/Summed-area_table
def build_sum_table(grid):
    table = []

    for y in range(len(grid)):
        row = []
        for x in range(len(grid)):
            s = grid[y][x]
            if x > 0:
                s += row[-1]
            if y > 0:
                s += table[y-1][x]
                if x > 0:
                    s -= table[y-1][x-1]
            row.append(s)
        table.append(row)

    return table
