from math import lcm
from re import findall


def parse_input(input):
    instructions, nodes = input.split("\n\n")

    instructions = [{"L": 0, "R": 1}[char] for char in instructions]

    nodes = {
        name: (left, right)
        for line in nodes.splitlines()
        for name, left, right in findall(r"(.+) = \((.+), (.+)\)", line)
    }

    return instructions, nodes


def part1(input):
    instructions, nodes = input
    step_count = 0
    location = "AAA"

    while location != "ZZZ":
        location = nodes[location][instructions[step_count % len(instructions)]]
        step_count += 1

    return step_count


def part2(input):
    instructions, nodes = input
    ghosts = {name: name for name in nodes.keys() if name.endswith("A")}
    steps_per_cycle = {}
    step_count = 0

    while len(steps_per_cycle) < len(ghosts):
        ghosts = {
            name: nodes[location][instructions[step_count % len(instructions)]]
            for name, location in ghosts.items()
        }

        step_count += 1

        for name, location in ghosts.items():
            if name not in steps_per_cycle and location.endswith("Z"):
                steps_per_cycle[name] = step_count

    return lcm(*steps_per_cycle.values())
