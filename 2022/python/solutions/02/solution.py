def parse_input(input):
    return map(lambda line: line.split(), input.splitlines())


def part1(strategy):
    return sum(score(them, us) for them, us in strategy)


def part2(strategy):
    def shape(them, result):
        match result:
            case 'X': return losses[them]
            case 'Y': return draws[them]
            case 'Z': return wins[them]

    return sum(score(them, shape(them, result)) for them, result in strategy)


def score(them, us):
    s = ord(us) - ord('X') + 1
    if us == draws[them]:
        s += 3
    elif us == wins[them]:
        s += 6
    return s


wins = {'A': 'Y', 'B': 'Z', 'C': 'X'}
draws = {'A': 'X', 'B': 'Y', 'C': 'Z'}
losses = {'A': 'Z', 'B': 'X', 'C': 'Y'}
