def parse_input(input):
    return [tuple(map(int, line.split(","))) for line in input.splitlines()]


def part1(points):
    largest_area = 0

    for i, (x1, y1) in enumerate(points):
        for x2, y2 in points[i + 1 :]:
            area = (abs(x1 - x2) + 1) * (abs(y1 - y2) + 1)
            largest_area = max(largest_area, area)

    return largest_area


def part2(points):
    areas = []
    for i, (x1, y1) in enumerate(points):
        for x2, y2 in points[i + 1 :]:
            area = (abs(x1 - x2) + 1) * (abs(y1 - y2) + 1)
            areas.append((area, (x1, y1), (x2, y2)))

    for area, p1, p2 in sorted(areas, reverse=True):
        if is_rectangle_inside_perimeter(p1, p2, points):
            return area


def is_rectangle_inside_perimeter(p1, p2, points):
    x_min, x_max = sorted([p1[0], p2[0]])
    y_min, y_max = sorted([p1[1], p2[1]])

    for p3, p4 in zip(points, points[-1:] + points[:-1]):
        px_min, px_max = sorted([p3[0], p4[0]])
        py_min, py_max = sorted([p3[1], p4[1]])

        if p3[0] == p4[0]:
            if x_min < p3[0] < x_max and not (py_max <= y_min or py_min >= y_max):
                return False
        elif y_min < p3[1] < y_max and not (px_max <= x_min or px_min >= x_max):
            return False

    return True
