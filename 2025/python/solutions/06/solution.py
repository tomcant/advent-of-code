from math import prod
from re import findall


def part1(input):
    *numbers, operators = input.splitlines()
    numbers = [list(map(int, findall(r"\d+", line))) for line in numbers]
    operators = list(findall(r"\S", operators))
    problems = list(zip(*numbers, operators))
    total = 0

    for problem in problems:
        *numbers, operator = problem
        match operator:
            case "+":
                total += sum(numbers)
            case "*":
                total += prod(numbers)

    return total


def part2(input):
    lines = input.splitlines()
    width = max(len(line) for line in lines)
    grid = [line + " " * (width - len(line)) for line in lines]
    height = len(grid)

    problems = []
    col = width - 1

    while col >= 0:
        if all(grid[row][col] == " " for row in range(height)):
            col -= 1
            continue

        problem_cols = []
        while col >= 0 and not all(grid[row][col] == " " for row in range(height)):
            problem_cols.append(col)
            col -= 1

        problems.append(problem_cols)

    total = 0

    for cols in problems:
        numbers = []

        for col in cols:
            digits = [
                grid[row][col] for row in range(height - 1) if grid[row][col].isdigit()
            ]
            numbers.append(int("".join(digits)))

        operator = grid[height - 1][cols[-1]]

        match operator:
            case "+":
                total += sum(numbers)
            case "*":
                total += prod(numbers)

    return total
