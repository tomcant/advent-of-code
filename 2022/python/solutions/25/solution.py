def part1(input):
    return decimal_to_snafu(sum([snafu_to_decimal(n) for n in input.splitlines()]))


def decimal_to_snafu(dec):
    snafu = ''
    while dec:
        m = map[dec % 5]
        snafu = m + snafu
        dec //= 5
        if map[m] < 0:
            dec += 1
    return snafu


def snafu_to_decimal(snafu):
    return sum(map[char] * 5 ** (len(snafu) - idx - 1) for idx, char in enumerate(snafu))


map = {
    '0': 0,
    '1': 1,
    '2': 2,
    '=': -2,
    '-': -1,
    0: '0',
    1: '1',
    2: '2',
    3: '=',
    4: '-',
}
