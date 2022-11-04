from collections import defaultdict
from re import match


def parse_input(input):
    records = defaultdict(list)
    current_guard = None

    for line in sorted(input.splitlines()):
        (minute, event) = match(r'\[[^\s]+ \d\d:(\d\d)\] (.+)', line).groups()

        if begins_shift := match(r'Guard #(\d+)', event):
            current_guard = int(begins_shift.group(1))
        else:
            records[current_guard].append((int(minute), event))

    return records


def part1(records):
    guard = find_guard_with_most_sleep(records)
    most_freq_minutes_asleep = find_most_freq_minute_asleep_per_guard(records)
    (minute, _) = most_freq_minutes_asleep[guard]

    return guard * minute


def part2(records):
    most_freq_minutes_asleep = find_most_freq_minute_asleep_per_guard(records)

    (guard, (minute, _)) = sorted(
        most_freq_minutes_asleep.items(),
        key=lambda tup: tup[1][1]
    )[-1]

    return guard * minute


def find_guard_with_most_sleep(records):
    sleep_time = defaultdict(int)

    for guard, events in records.items():
        fell_asleep_at = None

        for minute, event in events:
            if event == 'falls asleep':
                fell_asleep_at = minute
            elif event == 'wakes up':
                sleep_time[guard] += minute - fell_asleep_at

    (guard, _) = sorted(sleep_time.items(), key=lambda tup: tup[1])[-1]

    return guard


def find_most_freq_minute_asleep_per_guard(records):
    most_freq_minutes = {}

    for guard, events in records.items():
        freqs = defaultdict(int)
        fell_asleep_at = None

        for minute, event in events:
            if event == 'falls asleep':
                fell_asleep_at = minute
            elif event == 'wakes up':
                for m in range(fell_asleep_at, minute):
                    freqs[m] += 1

        most_freq_minutes[guard] = sorted(
            freqs.items(),
            key=lambda tup: tup[1]
        )[-1]

    return most_freq_minutes
