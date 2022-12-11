def parse_input(input):
    return map(lambda line: line.split(), input.splitlines())


def part1(cmds):
    return sum(cycle * register for cycle, register in execute(cmds) if (cycle-20) % 40 == 0)


def part2(cmds):
    display = [['.'] * 40 for _ in range(6)]

    for cycle, register in execute(cmds):
        if register-1 <= (cycle-1) % 40 <= register+1:
            display[(cycle-1) // 40][(cycle-1) % 40] = '#'

    return '\n' + '\n'.join(map(''.join, display))


def execute(cmds):
    cycle = 0
    register = 1
    cmd, ends_at = None, None

    while True:
        yield cycle, register

        if cycle == ends_at:
            if cmd[0] == 'addx':
                register += int(cmd[1])
            cmd = None

        if cmd is None:
            if (cmd := next(cmds, None)) is None:
                break
            match cmd[0]:
                case 'noop': ends_at = cycle + 1
                case 'addx': ends_at = cycle + 2

        cycle += 1
