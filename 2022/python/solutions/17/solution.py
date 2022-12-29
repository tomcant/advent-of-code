def part1(jets):
    (cave, *_), *_ = simulate(2022, jets)
    return height(cave)


def part2(jets):
    max_rocks = 1_000_000_000_000
    cache = {}

    def cache_key(cave, rock_idx, jet_idx):
        return (
            rock_idx % len(rocks),
            jet_idx % len(jets),
            tuple((x, y - height(cave)) for x, y in sorted(cave)[-10:])
        )

    for cave, rock_idx, jet_idx in simulate(max_rocks, jets):
        key = cache_key(cave, rock_idx, jet_idx)

        if key in cache:
            prev_rock_idx = cache[key]['rock_idx']
            prev_height = cache[key]['height']

            cycles, rocks_left_over = divmod(
                max_rocks - prev_rock_idx,
                rock_idx - prev_rock_idx
            )

            height_left_over = next(
                c['height'] - prev_height
                for c in cache.values()
                if c['rock_idx'] == prev_rock_idx + rocks_left_over
            )

            height_per_cycle = height(cave) - prev_height

            return prev_height + cycles * height_per_cycle + height_left_over

        cache[key] = {
            'rock_idx': rock_idx,
            'height': height(cave),
        }


def simulate(max_rocks, jets):
    cave = {(x, 0) for x in range(7)}
    jet_idx = 0

    for rock_idx in range(max_rocks):
        yield cave, rock_idx, jet_idx

        rock = make_rock(rock_idx, start_x=2, start_y=height(cave) + 4)

        while True:
            new_rock = right(rock) if jets[jet_idx % len(jets)] == '>' else left(rock)
            jet_idx += 1

            if not cave & new_rock:
                rock = new_rock

            new_rock = fall(rock)

            if not cave & new_rock:
                rock = new_rock
            else:
                cave |= rock
                break


def make_rock(idx, start_x, start_y):
    return {
        (start_x + x, start_y - y + height(rocks[idx % len(rocks)]))
        for y, row in enumerate(rocks[idx % len(rocks)])
        for x, char in enumerate(row)
        if char == '#'
    }


def fall(rock):
    return {(x, y - 1) for x, y in rock}


def left(rock):
    new_rock = {(x - 1, y) for x, y in rock}
    return new_rock if all(x >= 0 for x, _ in new_rock) else rock


def right(rock):
    new_rock = {(x + 1, y) for x, y in rock}
    return new_rock if all(x < 7 for x, _ in new_rock) else rock


def height(cave):
    match type(cave).__name__:
        case 'set':
            return max(y for _, y in cave)
        case 'tuple':
            return len(cave) - 1


rocks = [
    ('####',),
    (
        '.#.',
        '###',
        '.#.',
    ),
    (
        '..#',
        '..#',
        '###',
    ),
    (
        '#',
        '#',
        '#',
        '#',
    ),
    (
        '##',
        '##',
    ),
]
