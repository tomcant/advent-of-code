def parse_input(input):
    return map(lambda inventory: map(int, inventory.splitlines()), input.split('\n\n'))


def part1(inventories):
    return max(sum(inventory) for inventory in inventories)


def part2(inventories):
    return sum(sorted(sum(inventory) for inventory in inventories)[-3:])
