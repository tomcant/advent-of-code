from queue import PriorityQueue


def parse_input(input):
    lines = input.splitlines()

    grid = {
        complex(x, y): int(heat_loss)
        for y, row in enumerate(lines)
        for x, heat_loss in enumerate(row)
    }

    target_pos = complex(len(lines) - 1, len(lines[0]) - 1)

    return grid, target_pos


def part1(input):
    def neighbours(pos, dir, straight_dist):
        if straight_dist < 3:
            yield (pos + dir, dir, straight_dist + 1)
        yield (pos + 1j * dir, 1j * dir, 1)
        yield (pos - 1j * dir, -1j * dir, 1)

    grid, target_pos = input
    return min_heat_loss(grid, target_pos, neighbours)


def part2(input):
    def neighbours(pos, dir, straight_dist):
        if straight_dist < 10:
            yield (pos + dir, dir, straight_dist + 1)
        if straight_dist >= 4:
            yield (pos + 1j * dir, 1j * dir, 1)
            yield (pos - 1j * dir, -1j * dir, 1)

    grid, target_pos = input
    return min_heat_loss(grid, target_pos, neighbours)


def min_heat_loss(grid, target_pos, neighbours_fn):
    queue = PriorityQueue()
    queue.put(Node(0, 1, 0, 0))
    queue.put(Node(0, 1j, 0, 0))

    seen = set()

    while not queue.empty():
        node = queue.get()

        if node.key in seen:
            continue

        seen.add(node.key)

        if node.pos == target_pos:
            return node.heat_loss

        neighbours = neighbours_fn(node.pos, node.dir, node.straight_dist)

        for pos, dir, straight_dist in neighbours:
            if pos in grid:
                queue.put(Node(pos, dir, straight_dist, grid[pos] + node.heat_loss))


class Node:
    def __init__(self, pos, dir, straight_dist, heat_loss):
        self.pos = pos
        self.dir = dir
        self.straight_dist = straight_dist
        self.heat_loss = heat_loss
        self.key = (pos, dir, straight_dist)

    def __lt__(self, other):
        return self.heat_loss < other.heat_loss
