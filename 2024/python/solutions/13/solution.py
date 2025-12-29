from re import findall


def parse_input(input):
    return [map(int, findall(r"\d+", block)) for block in input.split("\n\n")]


def part1(machines):
    return sum(min_tokens_to_win(m, 0, 100) for m in machines)


def part2(machines):
    return sum(min_tokens_to_win(m, 10_000_000_000_000, None) for m in machines)


# We have to solve a system of 2 linear equations per machine:
#
#   A*(ax,ay) + B*(bx,by) = (px,py)
#     => (1) A*ax + B*bx = px
#        (2) A*ay + B*by = py
#
# We can solve for A and B using Cramer's rule:
#   A = (px*by - py*bx) / determinant
#   B = (ax*py - ay*px) / determinant
#
# Where determinant = ax*by - ay*bx
#
# https://en.wikipedia.org/wiki/Cramer%27s_rule
def min_tokens_to_win(machine, prize_offset, max_presses):
    ax, ay, bx, by, px, py = machine
    px += prize_offset
    py += prize_offset

    det = ax * by - ay * bx
    if det == 0:
        return 0

    a_numerator = px * by - py * bx
    b_numerator = ax * py - ay * px

    if a_numerator % det != 0 or b_numerator % det != 0:
        return 0

    a = a_numerator // det
    b = b_numerator // det

    if a < 0 or b < 0:
        return 0

    if max_presses is not None and (a > max_presses or b > max_presses):
        return 0

    return 3 * a + b
