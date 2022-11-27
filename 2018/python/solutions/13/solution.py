class Dir:
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)


def parse_input(input):
    carts, track = [], {}

    for y, line in enumerate(input.splitlines()):
        for x, char in enumerate(line):
            if char in ['>', '<', 'v', '^']:
                carts.append((
                    (x, y),
                    {
                        '>': Dir.RIGHT,
                        '<': Dir.LEFT,
                        'v': Dir.DOWN,
                        '^': Dir.UP,
                    }[char],
                    0
                ))

            match char:
                case '-' | '>' | '<': track[(x, y)] = '-'
                case '|' | '^' | 'v': track[(x, y)] = '|'
                case '/' | '\\' | '+': track[(x, y)] = char

    return carts, track


def part1(input):
    carts, track = input

    while True:
        carts.sort(key=lambda cart: cart[0])

        for idx, cart in enumerate(carts):
            carts[idx] = new_pos, *_ = move(cart, track)

            if any(new_pos == pos for cart_idx, [pos, *_] in enumerate(carts) if idx != cart_idx):
                return new_pos


def part2(input):
    carts, track = input

    while len(carts) > 1:
        carts.sort(key=lambda cart: cart[0])
        crashes = []

        for idx, cart in enumerate(carts):
            if idx in crashes:
                continue

            carts[idx] = new_pos, *_ = move(cart, track)
            crash_idxs = [idx for idx, [pos, *_] in enumerate(carts) if new_pos == pos]

            if len(crash_idxs) > 1:
                crashes += crash_idxs

        carts = [cart for idx, cart in enumerate(carts) if idx not in crashes]

    [(last_cart_pos, *_)] = carts
    return last_cart_pos


def move(cart, track):
    (x, y), (dx, dy), junctions = cart
    pos, dir = (x + dx, y + dy), (dx, dy)

    match track[pos]:
        case '/':
            match dir:
                case Dir.LEFT | Dir.RIGHT: dir = turn(dir, Dir.LEFT)
                case Dir.UP | Dir.DOWN: dir = turn(dir, Dir.RIGHT)

        case '\\':
            match dir:
                case Dir.LEFT | Dir.RIGHT: dir = turn(dir, Dir.RIGHT)
                case Dir.UP | Dir.DOWN: dir = turn(dir, Dir.LEFT)

        case '+':
            junctions += 1
            match junctions % 3:
                case 0: dir = turn(dir, Dir.RIGHT)
                case 1: dir = turn(dir, Dir.LEFT)

    return pos, dir, junctions


def turn(vec, dir):
    match dir:
        case Dir.LEFT: return vec[1], -vec[0]
        case Dir.RIGHT: return -vec[1], vec[0]
