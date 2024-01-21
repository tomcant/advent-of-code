from collections import defaultdict, deque


def parse_input(input):
    return {
        complex(x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
        if char != "#"
    }


def part1(grid):
    start_pos = complex(1, 0)
    target_pos = find_target_pos(grid)
    queue = deque([(start_pos, (), 0)])
    seen = {(): set()}

    SLOPES = {
        ">": 1,
        "<": -1,
        "v": 1j,
        "^": -1j,
    }

    while len(queue) > 0:
        pos, branch, steps = queue.popleft()

        if pos in seen[branch]:
            continue

        seen[branch].add(pos)

        if pos == target_pos:
            max_steps = steps
            continue

        neighbours = []

        for dir in (1, 1j, -1, -1j):
            neighbour = pos + dir

            if neighbour not in grid or neighbour in seen[branch]:
                continue

            if grid[neighbour] in "><v^" and neighbour != pos + SLOPES[grid[neighbour]]:
                continue

            neighbours.append(neighbour)

        for idx, neighbour in enumerate(neighbours):
            next_branch = branch

            if len(neighbours) > 1:
                next_branch = (*branch, idx)
                seen[next_branch] = set(seen[branch])

            queue.append((neighbour, next_branch, steps + 1))

    return max_steps


def part2(grid):
    start_pos = complex(1, 0)
    target_pos = find_target_pos(grid)
    graph = build_graph(grid)

    def search(pos, seen=set(), total_steps=0):
        if pos == target_pos:
            return total_steps

        max_steps = 0

        for neighbour, steps in graph[pos]:
            if neighbour not in seen:
                seen.add(neighbour)
                max_steps = max(max_steps, search(neighbour, seen, total_steps + steps))
                seen.remove(neighbour)

        return max_steps

    return search(start_pos)


def build_graph(grid):
    start_pos = complex(1, 0)
    target_pos = find_target_pos(grid)
    vertices = {start_pos, target_pos, *find_junctions(grid)}
    graph = defaultdict(list)

    for vertex in vertices:
        queue = [(vertex, 0)]
        seen = set()

        while len(queue) > 0:
            pos, steps = queue.pop()

            if pos in seen:
                continue

            seen.add(pos)

            if steps > 0 and pos in vertices:
                graph[vertex].append((pos, steps))
                continue

            for dir in (1, 1j, -1, -1j):
                if pos + dir in grid:
                    queue.append((pos + dir, steps + 1))

    return graph


def find_junctions(grid):
    junctions = []
    start_pos = complex(1, 0)
    queue = [start_pos]
    seen = set()

    while len(queue) > 0:
        pos = queue.pop()

        if pos in seen:
            continue

        seen.add(pos)

        neighbours = []
        for dir in (1, 1j, -1, -1j):
            if pos + dir in grid:
                neighbours.append(pos + dir)
                queue.append(pos + dir)

        if len(neighbours) >= 3:
            junctions.append(pos)

    return junctions


def find_target_pos(grid):
    max_x = max(x.real for x in grid)
    max_y = max(y.imag for y in grid)

    return complex(int(max_x), int(max_y))
