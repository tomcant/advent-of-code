from collections import Counter, defaultdict
from functools import cmp_to_key


def parse_input(input):
    return [line.split() for line in input.splitlines()]


def part1(hands):
    transformer = lambda hand: hand
    comparator = make_comparator("23456789TJQKA")

    return calc_winnings(hands, transformer, comparator)


def part2(hands):
    def transformer(hand):
        if "J" not in hand:
            return hand

        best_card = "A"
        counts = Counter(hand.replace("J", ""))

        if len(counts) > 0:
            [(best_card, _)] = counts.most_common(1)

        return hand.replace("J", best_card)

    comparator = make_comparator("J23456789TQKA")

    return calc_winnings(hands, transformer, comparator)


def make_comparator(card_order):
    order = {char: idx for idx, char in enumerate(card_order)}

    def compare(left, right):
        left_hand, _ = left
        right_hand, _ = right

        for idx, char in enumerate(left_hand):
            if order[char] > order[right_hand[idx]]:
                return 1
            if order[char] < order[right_hand[idx]]:
                return -1

        return 0

    return compare


def calc_winnings(hands, transformer, comparator):
    types = defaultdict(list)

    for hand in hands:
        counts = Counter(transformer(hand[0])).values()

        match len(counts):
            case 1:
                type = "five_of_a_kind"
            case 2:
                if 4 in counts:
                    type = "four_of_a_kind"
                else:
                    type = "full_house"
            case 3:
                if 3 in counts:
                    type = "three_of_a_kind"
                else:
                    type = "two_pair"
            case 4:
                type = "one_pair"
            case 5:
                type = "high_card"

        types[type].append(hand)

    sorted_hands = []
    for type in HAND_TYPES:
        sorted_hands += sorted(types[type], key=cmp_to_key(comparator))

    return sum((idx + 1) * int(bid) for idx, (_, bid) in enumerate(sorted_hands))


HAND_TYPES = [
    "high_card",
    "one_pair",
    "two_pair",
    "three_of_a_kind",
    "full_house",
    "four_of_a_kind",
    "five_of_a_kind",
]
