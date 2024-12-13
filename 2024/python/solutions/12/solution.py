from collections import defaultdict, deque


def parse_input(input):
    return {
        complex(x, y): char
        for y, row in enumerate(input.splitlines())
        for x, char in enumerate(row)
    }


def part1(grid):
    seen = set()

    def calc_region_price(pos_in_region):
        area, perimeter = 0, 0
        queue = deque([pos_in_region])

        while queue:
            pos = queue.popleft()
            if pos in seen:
                continue

            seen.add(pos)
            area += 1

            for dir in [1j, -1j, -1, 1]:
                neighbour = pos + dir
                if neighbour in grid and grid[neighbour] == grid[pos_in_region]:
                    queue.append(neighbour)
                else:
                    perimeter += 1

        return area * perimeter

    return sum(calc_region_price(pos) for pos in grid.keys() if pos not in seen)


def part2(grid):
    seen = set()

    def calc_region_price(start_pos):
        area, sides = 0, 0
        perimeter_by_dir = defaultdict(set)
        queue = deque([start_pos])

        while queue:
            pos = queue.popleft()
            if pos in seen:
                continue

            seen.add(pos)
            area += 1

            for dir in [1j, -1j, -1, 1]:
                neighbour = pos + dir
                if neighbour in grid and grid[neighbour] == grid[start_pos]:
                    queue.append(neighbour)
                else:
                    perimeter_by_dir[dir].add(pos)

        for dir, perimeter in perimeter_by_dir.items():
            perimeter_seen = set()

            for pos in perimeter:
                if pos in perimeter_seen:
                    continue

                sides += 1
                queue = deque([pos])

                while queue:
                    perimeter_pos = queue.popleft()
                    if perimeter_pos in perimeter_seen:
                        continue

                    perimeter_seen.add(perimeter_pos)

                    for dir_along_perimeter in [dir * 1j, dir * -1j]:
                        neighbour = perimeter_pos + dir_along_perimeter
                        if neighbour in perimeter:
                            queue.append(neighbour)

        return area * sides

    return sum(calc_region_price(pos) for pos in grid.keys() if pos not in seen)
