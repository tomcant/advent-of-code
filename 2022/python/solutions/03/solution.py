def parse_input(input):
    return input.splitlines()


def part1(rucksacks):
    priority_sum = 0

    for rucksack in rucksacks:
        item = (set(rucksack[:len(rucksack)//2]) & set(rucksack[len(rucksack)//2:])).pop()
        priority_sum += priority(item)

    return priority_sum


def part2(rucksacks):
    priority_sum = 0

    for group in [rucksacks[i:i+3] for i in range(0, len(rucksacks), 3)]:
        badge = set.intersection(*map(set, group)).pop()
        priority_sum += priority(badge)

    return priority_sum


def priority(item):
    return ord(item) - ((ord('a') - 1) if item.islower() else (ord('A') - 27))
