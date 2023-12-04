from collections import deque
from re import sub


def parse_input(input):
    return [
        [set(nums.split()) for nums in sub(r"Card \d+:", "", line).split("|")]
        for line in input.splitlines()
    ]


def part1(cards):
    points = 0

    for card in cards:
        winning_nums, chosen_nums = card
        matches = len(winning_nums & chosen_nums)
        points += 2 ** (matches - 1) if matches > 0 else 0

    return points


def part2(cards):
    card_count = len(cards)
    queue = deque(range(card_count))

    while len(queue) > 0:
        card_num = queue.popleft()
        winning_nums, chosen_nums = cards[card_num]
        matches = len(winning_nums & chosen_nums)

        if matches > 0:
            card_count += matches
            queue += range(card_num + 1, card_num + 1 + matches)

    return card_count
