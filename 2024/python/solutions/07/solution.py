def parse_input(input):
    equations = []

    for line in input.splitlines():
        target, nums = line.split(": ")
        equations.append((int(target), list(map(int, nums.split()))))

    return equations


def part1(equations):
    def options_fn(left, right):
        yield left + right
        yield left * right

    return calc_total_calibration(equations, options_fn)


def part2(equations):
    def options_fn(left, right):
        yield left + right
        yield left * right
        yield int(str(left) + str(right))

    return calc_total_calibration(equations, options_fn)


def calc_total_calibration(equations, options_fn):
    return sum(
        target if is_solvable(target, nums, options_fn) else 0
        for target, nums in equations
    )


def is_solvable(target, nums, options_fn):
    if len(nums) == 1:
        return nums == [target]

    for option in options_fn(nums[0], nums[1]):
        if is_solvable(target, [option] + nums[2:], options_fn):
            return True

    return False
