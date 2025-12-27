def parse_input(input):
    parts = input.split("\n\n")
    shapes = [shape.splitlines()[1:] for shape in parts[:-1]]

    spaces = []
    for space in parts[-1].splitlines():
        size, presents_to_fit = space.split(": ")
        width, height = map(int, size.split("x"))
        presents_to_fit = map(int, presents_to_fit.split())
        spaces.append((width, height, presents_to_fit))

    return shapes, spaces


def part1(input):
    shapes, spaces = input
    shape_areas = [sum(line.count("#") for line in shape) for shape in shapes]
    region_count = 0

    for space in spaces:
        width, height, presents_to_fit = space

        required_area = sum(
            shape_areas[i] * count for i, count in enumerate(presents_to_fit)
        )

        if required_area <= width * height:
            region_count += 1

    return region_count
