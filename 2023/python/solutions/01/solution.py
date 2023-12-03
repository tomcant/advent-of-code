from re import findall


def parse_input(input):
    return input.splitlines()


def part1(lines):
    return sum(
        int(digits[0] + digits[-1])
        for digits in [findall(r"\d", line) for line in lines]
    )


def part2(lines):
    lines = [
        tuple(findall(r"(?=(\d|one|two|three|four|five|six|seven|eight|nine))", line))
        for line in lines
    ]
    return sum(int(to_digit(digits[0]) + to_digit(digits[-1])) for digits in lines)


def to_digit(digit):
    return DIGITS[digit] if digit in DIGITS else digit


DIGITS = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
}
