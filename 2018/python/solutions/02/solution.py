from collections import Counter
from itertools import combinations


def parse_input(input):
    return input.splitlines()


def part1(box_ids):
    has_two, has_three = 0, 0

    for box_id in box_ids:
        counts = Counter(box_id).values()
        has_two += 2 in counts
        has_three += 3 in counts

    return has_two * has_three


def part2(box_ids):
    similarity_threshold = 1

    for box_id, other_box_id in combinations(box_ids, 2):
        similarities = ''

        for k in range(len(box_id)):
            if box_id[k] == other_box_id[k]:
                similarities += box_id[k]

        if len(box_id) - len(similarities) == similarity_threshold:
            return similarities
