from collections import deque


def parse_input(input):
    trailheads = set()
    map = {}

    for y, row in enumerate(input.splitlines()):
        for x, num in enumerate(row):
            pos = complex(x, y)
            if num == "0":
                trailheads.add(pos)
            map[pos] = int(num)

    return map, trailheads


def part1(input):
    map, trailheads = input

    def count_peaks(trailhead):
        peak_count = 0
        queue = deque([trailhead])
        seen = set()

        while queue:
            pos = queue.popleft()
            if pos in seen:
                continue

            seen.add(pos)

            if map[pos] == 9:
                peak_count += 1
                continue

            for dir in [1j, -1j, -1, 1]:
                neighbour = pos + dir
                if neighbour in map and map[neighbour] - map[pos] == 1:
                    queue.append(neighbour)

        return peak_count

    return sum(count_peaks(trailhead) for trailhead in trailheads)


def part2(input):
    map, trailheads = input

    def count_trails(trailhead):
        trail_count = 0
        queue = deque([(trailhead, None)])
        seen = set()

        while queue:
            node = queue.popleft()
            if node in seen:
                continue

            seen.add(node)
            pos, *path = node

            if map[pos] == 9:
                trail_count += 1
                continue

            for dir in [1j, -1j, -1, 1]:
                neighbour = pos + dir
                if neighbour in map and map[neighbour] - map[pos] == 1:
                    queue.append((neighbour, dir, *path))

        return trail_count

    return sum(count_trails(trailhead) for trailhead in trailheads)
