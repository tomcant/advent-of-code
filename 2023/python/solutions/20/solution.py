from collections import deque
from itertools import count
from math import lcm


def parse_input(input):
    modules = {}

    for line in input.splitlines():
        name, outputs = line.split(" -> ")
        type = "broadcast"

        if name[0] in ("%", "&"):
            type, name = name[0], name[1:]

        modules[name] = type, outputs.split(", ")

    flip_flops = {name: False for name, (type, _) in modules.items() if type == "%"}

    conjunctions = {
        module: {
            module_: False
            for module_, (_, outputs), in modules.items()
            if module in outputs
        }
        for module, (type, _) in modules.items()
        if type == "&"
    }

    initial_state = (flip_flops, conjunctions)

    return modules, initial_state


def part1(input):
    modules, (flip_flops, conjunctions) = input
    pulses = {True: 0, False: 0}

    for _ in range(1000):
        for _, pulse in push_the_button(modules, flip_flops, conjunctions):
            pulses[pulse] += 1

    return pulses[True] * pulses[False]


def part2(input):
    modules, (flip_flops, conjunctions) = input
    output_module = find_output_module(modules)
    [input_module] = find_input_modules(modules, output_module)
    periodic_modules = find_input_modules(modules, input_module)
    periods = []

    for button_press in count(1):
        for module, pulse in push_the_button(modules, flip_flops, conjunctions):
            if not pulse and module in periodic_modules:
                periods.append(button_press)
                periodic_modules.remove(module)

                if len(periodic_modules) == 0:
                    return lcm(*periods)


def push_the_button(modules, flip_flops, conjunctions):
    queue = deque([("button", False, "broadcaster")])

    while len(queue) > 0:
        caller, pulse, module = queue.popleft()

        yield module, pulse

        if module not in modules:
            continue

        type, outputs = modules[module]
        next_pulse = None

        match type:
            case "broadcast":
                next_pulse = pulse

            case "%":
                if not pulse:
                    next_pulse = flip_flops[module] = not flip_flops[module]

            case "&":
                conjunctions[module][caller] = pulse
                next_pulse = not all(conjunctions[module].values())

        if next_pulse != None:
            for output in outputs:
                queue.append((module, next_pulse, output))


def find_input_modules(modules, module):
    return {name for name, (_, outputs) in modules.items() if module in outputs}


def find_output_module(modules):
    for _, (_, outputs) in modules.items():
        for output in outputs:
            if output not in modules:
                return output
