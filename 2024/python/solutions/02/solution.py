from collections import Counter


def parse_input(input):
    return [list(map(int, line.split())) for line in input.splitlines()]


def part1(reports):
    return sum(1 if is_safe(report) else 0 for report in reports)


def part2(reports):
    safe_reports = 0

    for report in reports:
        if is_safe(report):
            safe_reports += 1
            continue
        for i in range(len(report)):
            if is_safe(report[:i] + report[i + 1 :]):
                safe_reports += 1
                break

    return safe_reports


def is_safe(report):
    diffs = [report[i + 1] - report[i] for i in range(len(report) - 1)]

    return (
        all(map(lambda diff: 1 <= abs(diff) <= 3, diffs))
        and len(Counter(map(sign, diffs))) == 1
    )


def sign(num):
    return 1 if num > 0 else -1
