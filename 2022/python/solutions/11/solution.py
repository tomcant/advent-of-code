from math import lcm, prod


def parse_input(input):
    def parse_monkey(monkey):
        lines = monkey.splitlines()

        return {
            'items': list(map(int, lines[1].split(':')[-1].split(','))),
            'operation': lambda old: eval(lines[2].split('=')[-1]),
            'test': {
                'divisor': int(lines[3].split()[-1]),
                True: int(lines[4].split()[-1]),
                False: int(lines[5].split()[-1]),
            },
            'inspections': 0,
        }

    return list(map(parse_monkey, input.split('\n\n')))


def part1(monkeys):
    for _ in range(20):
        play_round(monkeys, lambda stress: stress // 3)

    return level_of_monkey_business(monkeys)


def part2(monkeys):
    mod = lcm(*[monkey['test']['divisor'] for monkey in monkeys])

    for _ in range(10_000):
        play_round(monkeys, lambda stress: stress % mod)

    return level_of_monkey_business(monkeys)


def play_round(monkeys, worry_manager):
    for monkey in monkeys:
        while monkey['items']:
            old_worry = monkey['items'].pop(0)
            new_worry = worry_manager(monkey['operation'](old_worry))
            next_monkey = monkey['test'][new_worry % monkey['test']['divisor'] == 0]
            monkeys[next_monkey]['items'].append(new_worry)
            monkey['inspections'] += 1


def level_of_monkey_business(monkeys):
    return prod(sorted(monkey['inspections'] for monkey in monkeys)[-2:])
