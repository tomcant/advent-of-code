from re import findall


def parse_input(input):
    return input.splitlines()


def part1(lines):
    return sum(int(digits[0] + digits[-1]) for digits in [findall(r'\d', line) for line in lines])


def part2(lines):
    lines = [
        tuple(findall(r'(?=(\d|one|two|three|four|five|six|seven|eight|nine))', line))
        for line in lines
    ]
    return sum(
        int(to_digit(digits[0]) + to_digit(digits[-1]))
        for digits in lines
    )


def to_digit(digit):
    match digit:
        case 'one': return '1'
        case 'two': return '2'
        case 'three': return '3'
        case 'four': return '4'
        case 'five': return '5'
        case 'six': return '6'
        case 'seven': return '7'
        case 'eight': return '8'
        case 'nine': return '9'
        case _: return digit
