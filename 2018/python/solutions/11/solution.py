def parse_input(input):
    def calc_power_level(x, y, serial_num):
        rack_id = x + 10
        return (rack_id * y + serial_num) * rack_id / 100 % 10 - 5

    return [[calc_power_level(x, y, int(input))
            for x in range(1, 301)] for y in range(1, 301)]


def part1(grid):
    max_power = 0
    square_pos = None

    for y in range(len(grid) - 2):
        for x in range(len(grid[y]) - 2):
            power = 0
            for i in range(3):
                for j in range(3):
                    power += grid[y + i][x + j]
            if power > max_power:
                max_power = power
                square_pos = x + 1, y + 1

    return square_pos


def part2(grid):
    max_power = 0
    square_pos = None
    square_size = None

    for y in range(len(grid)):
        for x in range(len(grid[y])):
            for size in range(1, min(len(grid[y]) - x, len(grid) - y) + 1):
                power = 0
                for i in range(size):
                    for j in range(size):
                        power += grid[y + i][x + j]
                if power > max_power:
                    max_power = power
                    square_pos = x + 1, y + 1
                    square_size = size

    return square_pos, square_size
