from collections import defaultdict


def parse_input(input):
    rules_raw, updates_raw = input.split("\n\n")
    updates = map(lambda pages: list(map(int, pages.split(","))), updates_raw.split())
    rules = map(lambda rule: list(map(int, rule.split("|"))), rules_raw.split())

    rules_by_page = defaultdict(set)
    for page, comes_before in rules:
        rules_by_page[page].add(comes_before)

    return rules_by_page, updates


def part1(input):
    rules, updates = input

    return sum(
        pages[len(pages) // 2] if len(find_unordered(pages, rules)) == 0 else 0
        for pages in updates
    )


def part2(input):
    rules, updates = input
    fixed_updates = []

    for pages in updates:
        unordered = find_unordered(pages, rules)
        if len(unordered) == 0:
            continue

        for unordered_page in unordered:
            for idx, page in enumerate(pages):
                if page in rules[unordered_page]:
                    pages.pop(pages.index(unordered_page))
                    pages.insert(idx, unordered_page)
                    break

        fixed_updates.append(pages)

    return sum(pages[len(pages) // 2] for pages in fixed_updates)


def find_unordered(pages, rules):
    unordered = set()

    for idx, page in enumerate(pages[:-1]):
        for other_page in pages[idx + 1 :]:
            if page in rules[other_page]:
                unordered.add(other_page)

    return unordered
