from re import findall


def parse_input(input):
    map, path = input.split('\n\n')

    map = {(x, y): c for y, row in enumerate(map.splitlines()) for x, c in enumerate(row) if c != ' '}
    path = [int(i) if i.isnumeric() else i for i in findall('R|L|\d+', path)]

    return map, path


def part1(input):
    return password(*follow_path(*input, wrap_2d))


def part2(input):
    return password(*follow_path(*input, wrap_3d))


def follow_path(map, path, wrap_fn):
    pos = find_start(map)
    dir = Dir.RIGHT

    for instruction in path:
        match instruction:
            case 'L': dir = turn(dir, Dir.LEFT)
            case 'R': dir = turn(dir, Dir.RIGHT)
            case _:
                for _ in range(instruction):
                    npos = pos[0] + dir[0], pos[1] + dir[1]
                    ndir = dir

                    if npos not in map:
                        npos, ndir = wrap_fn(map, pos, dir)

                    if map[npos] == '#':
                        break

                    pos = npos
                    dir = ndir

    return pos, dir


def find_start(map):
    (ystart, xstart), *_ = sorted((y, x) for x, y in map)
    return xstart, ystart


def turn(vec, dir):
    match dir:
        case Dir.LEFT: return vec[1], -vec[0]
        case Dir.RIGHT: return -vec[1], vec[0]


def password(pos, dir):
    facing = {
        Dir.RIGHT: 0,
        Dir.DOWN: 1,
        Dir.LEFT: 2,
        Dir.UP: 3,
    }
    return sum([
        1000 * (pos[1] + 1),
        4 * (pos[0] + 1),
        facing[dir]
    ])


def wrap_2d(map, pos, dir):
    match dir:
        case Dir.RIGHT: npos = min(x for x, y in map if y == pos[1]), pos[1]
        case Dir.LEFT: npos = max(x for x, y in map if y == pos[1]), pos[1]
        case Dir.DOWN: npos = pos[0], min(y for x, y in map if x == pos[0])
        case Dir.UP: npos = pos[0], max(y for x, y in map if x == pos[0])

    return npos, dir


def wrap_3d(_map, pos, dir):
    (col, x), (row, y) = [divmod(coord, 50) for coord in pos]

    faces = {
        0: {2: 4, 3: 6},
        1: {0: 1, 1: 3, 2: 5},
        2: {0: 2},
    }

    match faces[col][row]:
        case 1:
            match dir:
                case Dir.UP: return (0, x + 150), Dir.RIGHT
                case Dir.LEFT: return (0, 149 - y), Dir.RIGHT
        case 2:
            match dir:
                case Dir.UP: return (x, 199), Dir.UP
                case Dir.DOWN: return (99, x + 50), Dir.LEFT
                case Dir.RIGHT: return (99, 149 - y), Dir.LEFT
        case 3:
            match dir:
                case Dir.LEFT: return (y, 100), Dir.DOWN
                case Dir.RIGHT: return (y + 100, 49), Dir.UP
        case 4:
            match dir:
                case Dir.UP: return (50, x + 50), Dir.RIGHT
                case Dir.LEFT: return (50, 49 - y), Dir.RIGHT
        case 5:
            match dir:
                case Dir.RIGHT: return (149, 49 - y), Dir.LEFT
                case Dir.DOWN: return (49, x + 150), Dir.LEFT
        case 6:
            match dir:
                case Dir.LEFT: return (y + 50, 0), Dir.DOWN
                case Dir.RIGHT: return (y + 50, 149), Dir.UP
                case Dir.DOWN: return (x + 100, 0), Dir.DOWN


class Dir:
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)
