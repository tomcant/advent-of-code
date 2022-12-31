from collections import defaultdict, deque


def parse_input(input):
    return ValleyMap.from_string(input)


def part1(map):
    queue = deque([(map.start, 0)])
    seen = set()

    while queue:
        state = queue.popleft()
        if state in seen:
            continue

        seen.add(state)
        pos, minute = state

        if pos == map.finish:
            return minute

        queue += [(choice, minute + 1) for choice in map.choices(pos, minute)]


def part2(map):
    target = map.finish
    reached_target = 0

    queue = deque([(map.start, 0)])
    seen = set()

    while queue:
        state = queue.popleft()
        if state in seen:
            continue

        seen.add(state)
        pos, minute = state

        if pos == target:
            reached_target += 1

            if target == map.finish:
                if reached_target > 2:
                    return minute
                target = map.start
            else:
                target = map.finish

            queue = deque([(pos, minute + 1)])
            continue

        queue += [(choice, minute + 1) for choice in map.choices(pos, minute)]


class ValleyMap:
    def __init__(self, blizzards, boundary, start, finish):
        self.blizzards = defaultdict(
            lambda: defaultdict(list),
            {0: blizzards}
        )

        self.boundary = boundary
        self.start = start
        self.finish = finish

        self.width = max(x for x, _ in boundary) + 1
        self.height = max(y for _, y in boundary) + 1

    @classmethod
    def from_string(cls, string):
        lines = string.splitlines()
        blizzards = defaultdict(list)
        boundary = set()

        for y, line in enumerate(lines):
            for x, char in enumerate(line):
                if char == '#':
                    boundary.add((x, y))
                elif char in DIRS:
                    blizzards[x, y].append(DIRS[char])

        start = lines[0].find('.'), 0
        finish = lines[-1].find('.'), len(lines) - 1

        return cls(blizzards, boundary, start, finish)

    def choices(self, pos, minute):
        return [
            choice for choice in [
                (pos[0] + dx, pos[1] + dy)
                for dx, dy in DIRS.values()
                if 0 <= pos[1] + dy < self.height
            ]
            if choice not in self.boundary
            and choice not in self._blizzards_at(minute + 1)
        ]

    def _blizzards_at(self, minute):
        if minute in self.blizzards:
            return self.blizzards[minute]

        last_blizzards = self._blizzards_at(minute - 1)

        for (x, y), dirs in last_blizzards.items():
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy

                if not 1 <= nx <= self.width - 2:
                    nx = self.width - 1 - clamp(nx, 1, self.width - 2)

                if not 1 <= ny <= self.height - 2:
                    ny = self.height - 1 - clamp(ny, 1, self.height - 2)

                self.blizzards[minute][nx, ny].append((dx, dy))

        return self.blizzards[minute]


def clamp(val, low, high):
    return max(low, min(val, high))


DIRS = {
    '_': (0, 0),
    '>': (1, 0),
    'v': (0, 1),
    '<': (-1, 0),
    '^': (0, -1),
}
