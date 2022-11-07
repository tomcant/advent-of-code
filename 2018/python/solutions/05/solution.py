import string


def part1(polymer):
    return len(reduce(polymer))


def part2(polymer):
    replacements = [{ord(char): '', ord(char.upper()): ''}
                    for char in string.ascii_lowercase]

    return min(len(reduce(polymer.translate(reps))) for reps in replacements)


def reduce(polymer):
    while True:
        next = react(polymer)
        if next == polymer:
            return next
        polymer = next


def react(polymer):
    def react_pairs(pairs):
        return ''.join(filter(lambda p: len(p) < 2 or not is_match(p), pairs))

    next = react_pairs([polymer[i:i+2] for i in range(0, len(polymer), 2)])
    return next[0] + react_pairs([next[i:i+2] for i in range(1, len(next), 2)])


def is_match(pair):
    return (pair[0].islower() and pair[1].isupper() and pair[0] == pair[1].lower()) \
        or (pair[0].isupper() and pair[1].islower() and pair[0] == pair[1].upper())
