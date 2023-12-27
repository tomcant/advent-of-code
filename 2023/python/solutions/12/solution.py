from functools import cache


def parse_input(input):
    records = []

    for line in input.splitlines():
        springs, groups = line.split()
        records.append((springs, [int(n) for n in groups.split(",")]))

    return records


def part1(records):
    return sum(count_arrangements(*record) for record in records)


def part2(records):
    unfolded_records = [
        ("?".join([springs] * 5), groups * 5) for springs, groups in records
    ]
    return sum(count_arrangements(*record) for record in unfolded_records)


def count_arrangements(springs, groups):
    @cache
    def count(spring, group, size=0):
        if spring == len(springs):
            if group == len(groups) and size == 0:
                return 1
            if group + 1 == len(groups) and size == groups[-1]:
                return 1
            return 0

        ret = 0

        if springs[spring] in ("#", "?"):
            ret += count(spring + 1, group, size + 1)

        if springs[spring] in (".", "?"):
            if size == 0:
                ret += count(spring + 1, group, 0)
            elif group < len(groups) and size == groups[group]:
                ret += count(spring + 1, group + 1, 0)

        return ret

    return count(spring=0, group=0)
