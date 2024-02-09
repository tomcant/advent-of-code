from itertools import combinations
from re import findall


def parse_input(input):
    return [list(map(int, findall(r"-?\d+", line))) for line in input.splitlines()]


def part1(hailstones):
    range_min = 200000000000000
    range_max = 400000000000000

    collisions = 0
    pairs = combinations(hailstones, 2)

    for (h0x, h0y, _, h0vx, h0vy, _), (h1x, h1y, _, h1vx, h1vy, _) in pairs:
        h0m = h0vy / h0vx
        h1m = h1vy / h1vx

        if h0m == h1m:
            continue

        h0c = h0y - h0m * h0x
        h1c = h1y - h1m * h1x

        x = (h0c - h1c) / (h1m - h0m)
        y = h0m * x + h0c

        if not (range_min <= x <= range_max and range_min <= y <= range_max):
            continue

        in_future_for_a = (
            (x - (h0x + h0vx) < x - h0x) if x > h0x else (x - (h0x + h0vx) > x - h0x)
        )
        in_future_for_b = (
            (x - (h1x + h1vx) < x - h1x) if x > h1x else (x - (h1x + h1vx) > x - h1x)
        )

        if in_future_for_a and in_future_for_b:
            collisions += 1

    return collisions


def part2(hailstones):
    # We need a system of 6 linear equations in order to solve for 6 unknowns (the rock's position and velocity). Using
    # the following as a starting point...
    #
    #   =>  Rx + Rvx * t[n] = H[n]x + H[n]vx * t[n]
    #   =>  Ry + Rvy * t[n] = H[n]y + H[n]vy * t[n]
    #   =>  Rz + Rvz * t[n] = H[n]z + H[n]vz * t[n]
    #
    # We can isolate t[n] and equate its three forms to find a system of equations with quadratic terms like Rx*Rvy. To
    # solve this using an easily codifiable method (e.g. Gaussian elimination or Cramer's rule) we need to simplify into
    # a system of linear equations instead.
    #
    # By setting n=0 and n=k for k=1,2,3... and inspecting the difference between equations for each Hn and H0, we see
    # that these non-linear terms can be eliminated, leaving a linear system in (Rx, Ry, Rz), (Rvx, Rvy, Rvz), and the
    # hailstone position/velocity constants.
    #
    # Finally, we can use Cramer's rule to solve for the unknowns.

    equations = []
    h0x, h0y, h0z, h0vx, h0vy, h0vz = hailstones[0]

    for hnx, hny, hnz, hnvx, hnvy, hnvz in hailstones[1:4]:
        x, y, z = hnvy - h0vy, h0vx - hnvx, 0
        vx, vy, vz = h0y - hny, hnx - h0x, 0

        lhs = (x, y, z, vx, vy, vz)
        rhs = hnx * hnvy - h0x * h0vy - hnvx * hny + h0vx * h0y
        equations.append((lhs, rhs))

        x, y, z = hnvz - h0vz, 0, h0vx - hnvx
        vx, vy, vz = h0z - hnz, 0, hnx - h0x

        lhs = (x, y, z, vx, vy, vz)
        rhs = hnx * hnvz - h0x * h0vz - hnvx * hnz + h0vx * h0z
        equations.append((lhs, rhs))

    solutions = solve(equations)
    return int(sum(solutions[0:3]))


# This uses Cramer's rule to find the solutions to a system of linear equations.
# https://en.wikipedia.org/wiki/Cramer%27s_rule
def solve(equations):
    matrix = [lhs for lhs, _ in equations]
    main_det = determinant(matrix)

    if main_det == 0:
        return 0

    solutions = []
    order = len(matrix)
    results = [rhs for _, rhs in equations]

    for i in range(order):
        sub_matrix = []
        for j in range(order):
            row = []
            for k in range(order):
                if k == i:
                    row.append(results[j])
                else:
                    row.append(matrix[j][k])
            sub_matrix.append(row)

        sub_det = determinant(sub_matrix)
        solutions.append(sub_det / main_det)

    return solutions


# This uses Laplace expansion to calculate the determinant of an NxN matrix.
# https://en.wikipedia.org/wiki/Laplace_expansion
def determinant(matrix, val=1):
    order = len(matrix)

    if order == 1:
        return val * matrix[0][0]

    result = 0

    for i in range(order):
        sub_matrix = []
        for j in range(1, order):
            row = []
            for k in range(order):
                if k != i:
                    row.append(matrix[j][k])
            sub_matrix.append(row)

        sub_det = determinant(sub_matrix, (-1) ** i * matrix[0][i])
        result += sub_det * val

    return result
