def part1(input):
    max_recipes = int(input) + 10
    scores = [3, 7]
    elf1, elf2 = 0, 1

    while len(scores) < max_recipes:
        scores, elf1, elf2 = make_recipes(scores, elf1, elf2)

    if max_recipes == len(scores):
        return ''.join(map(str, scores[-10:]))

    return ''.join(map(str, scores[-11:-1]))


def part2(input):
    sequence = list(map(int, input))
    seq_len = len(sequence)
    scores = [3, 7]
    elf1, elf2 = 0, 1

    while True:
        scores, elf1, elf2 = make_recipes(scores, elf1, elf2)

        if sequence == scores[-seq_len-1:-1]:
            return len(scores) - seq_len - 1

        if sequence == scores[-seq_len:]:
            return len(scores) - seq_len


def make_recipes(scores, elf1, elf2):
    for digit in str(scores[elf1] + scores[elf2]):
        scores.append(int(digit))

    elf1 = (elf1 + scores[elf1] + 1) % len(scores)
    elf2 = (elf2 + scores[elf2] + 1) % len(scores)

    return scores, elf1, elf2
