def parse_input(input):
    monkeys = {}

    for line in input.splitlines():
        monkey, math = line.split(': ')
        monkeys[monkey] = int(math) if math.isnumeric() else math.split()

    return monkeys


def part1(monkeys):
    return resolve(build_tree(monkeys))


def part2(monkeys):
    del monkeys['humn']
    lhs, _, rhs = build_tree(monkeys)
    return solve(lhs, resolve(rhs), 'humn')


def build_tree(monkeys):
    def build(monkey):
        if monkey not in monkeys:
            return monkey

        if type(monkeys[monkey]) == int:
            return monkeys[monkey]

        lhs, op, rhs = monkeys[monkey]
        return build(lhs), op, build(rhs)

    return build('root')


def resolve(tree):
    if type(tree) != tuple:
        return tree

    lhs, op, rhs = tree
    lhs = resolve(lhs)
    rhs = resolve(rhs)

    if type(lhs) is not int or type(rhs) is not int:
        return tree

    match op:
        case '+': return lhs + rhs
        case '-': return lhs - rhs
        case '*': return lhs * rhs
        case '/': return lhs // rhs


def solve(lhs, rhs, solve_for):
    def _solve(lhs, rhs):
        if lhs == solve_for:
            return rhs

        l, op, r = lhs
        l = resolve(l)
        r = resolve(r)

        if type(l) is int:
            match op:
                case '+': return _solve(r, rhs - l)
                case '-': return _solve(r, l - rhs)
                case '*': return _solve(r, rhs // l)
                case '/': return _solve(r, l // rhs)

        match op:
            case '+': return _solve(l, rhs - r)
            case '-': return _solve(l, rhs + r)
            case '*': return _solve(l, rhs // r)
            case '/': return _solve(l, rhs * r)

    return _solve(lhs, rhs)
