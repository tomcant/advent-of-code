from collections import defaultdict
from re import findall, match


def parse_input(input):
    stacks = defaultdict(list)
    moves = []

    for line in input.splitlines():
        if line.startswith('move'):
            moves.append(tuple(map(int, findall(r'\d+', line))))
        else:
            for i in range(1, len(line), 4):
                if match('\w', line[i]):
                    stacks[i].insert(0, line[i])

    stacks = [crates for _, crates in sorted(stacks.items())]
    return stacks, moves


def part1(input):
    stacks, moves = input

    for num_crates, from_idx, to_idx in moves:
        for _ in range(num_crates):
            stacks[to_idx - 1].append(stacks[from_idx - 1].pop())

    return ''.join(top_crate for *_, top_crate in stacks)


def part2(input):
    stacks, moves = input

    for num_crates, from_idx, to_idx in moves:
        stacks[to_idx - 1] += stacks[from_idx - 1][-num_crates:]
        stacks[from_idx - 1] = stacks[from_idx - 1][:-num_crates]

    return ''.join(top_crate for *_, top_crate in stacks)
