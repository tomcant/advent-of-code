from collections import deque
import z3


def parse_input(input):
    machines = []

    for line in input.splitlines():
        parts = line.split()
        lights = [char == "#" for char in parts[0][1:-1]]
        buttons = [list(map(int, button[1:-1].split(","))) for button in parts[1:-1]]
        joltage = list(map(int, parts[-1][1:-1].split(",")))
        machines.append((lights, buttons, joltage))

    return machines


def part1(machines):
    solutions = []

    for machine in machines:
        lights, buttons, _ = machine

        initial = (False,) * len(lights)
        queue = deque([(initial, 0)])
        seen = set()

        while len(queue) > 0:
            state, presses = queue.popleft()

            if state == tuple(lights):
                solutions.append(presses)
                break

            if state in seen:
                continue

            seen.add(state)

            for button in buttons:
                new_state = tuple(
                    not light if i in button else light for i, light in enumerate(state)
                )
                queue.append((new_state, presses + 1))

    return sum(solutions)


def part2(machines):
    solutions = []

    for machine in machines:
        _, buttons, joltages = machine

        presses = list(map(z3.Int, range(len(buttons))))

        optimiser = z3.Optimize()
        optimiser.minimize(sum(presses))
        optimiser.add([p >= 0 for p in presses])

        for i, joltage in enumerate(joltages):
            joltage_sum = sum(
                presses[j] for j, button in enumerate(buttons) if i in button
            )
            optimiser.add(joltage_sum == joltage)

        optimiser.check()
        model = optimiser.model()
        solutions.append(sum(model[p].as_long() for p in presses))

    return sum(solutions)
