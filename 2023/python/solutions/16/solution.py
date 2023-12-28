def parse_input(input):
    return {
        (x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
    }


def part1(grid):
    return count_energised_tiles(grid, beam=((-1, 0), (1, 0)))


def part2(grid):
    width = max(x for x, _ in grid) + 1
    height = max(y for _, y in grid) + 1

    beams = [
        *[((x, -1), (0, 1)) for x in range(width)],
        *[((x, height), (0, -1)) for x in range(width)],
        *[((-1, y), (1, 0)) for y in range(height)],
        *[((width, y), (-1, 0)) for y in range(height)],
    ]

    return max(count_energised_tiles(grid, beam) for beam in beams)


def count_energised_tiles(grid, beam):
    beams = [beam]
    seen = set()

    while True:
        moved = False

        for idx in range(len(beams)):
            beam = beams[idx]

            if beam in seen:
                continue

            seen.add(beam)

            (x, y), (dx, dy) = beam
            new_pos = x + dx, y + dy

            if new_pos not in grid:
                continue

            dir = dx, dy
            new_dir = dir

            match grid[new_pos]:
                case "|":
                    if dx != 0:
                        new_dir = turn_right(dir)
                        beams.append((new_pos, turn_left(dir)))

                case "-":
                    if dy != 0:
                        new_dir = turn_right(dir)
                        beams.append((new_pos, turn_left(dir)))

                case "\\":
                    new_dir = turn_left(dir) if dy != 0 else turn_right(dir)

                case "/":
                    new_dir = turn_right(dir) if dy != 0 else turn_left(dir)

            beams[idx] = new_pos, new_dir
            moved = True

        if not moved:
            break

    return len({pos for pos, _ in seen}) - 1


def turn_right(dir):
    return -dir[1], dir[0]


def turn_left(dir):
    return dir[1], -dir[0]
