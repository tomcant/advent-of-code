def parse_input(input):
    lines = input.splitlines()
    return lines[0][15:], dict(map(lambda line: line.split(' => '), lines[2:]))


def part1(input):
    initial, rules = input
    last = initial
    max_generations = 20

    for _ in range(max_generations):
        last = '....' + last + '....'
        line = ''

        for i in range(len(last) - 4):
            line += rules[last[i:i+5]]

        last = line

    return sum(idx - 2 * max_generations for idx, val in enumerate(last) if val == '#')


def part2(input):
    initial, rules = input
    last = initial
    max_generations = 50_000_000_000
    generations = set()

    while last.strip('.') not in generations:
        generations.add(last.strip('.'))
        last = '....' + last + '....'
        line = ''

        for i in range(len(last) - 4):
            line += rules[last[i:i+5]]

        last = line

    pot_sum = sum(idx - 2 * len(generations) for idx, val in enumerate(last) if val == '#')

    return pot_sum + 8 * (max_generations - len(generations))
