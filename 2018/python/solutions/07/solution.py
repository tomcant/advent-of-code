from collections import defaultdict
from re import match


def parse_input(input):
    graph = defaultdict(set)

    for line in input.splitlines():
        (dependency, step) = match(r'Step (\w) .+ step (\w)', line).groups()
        graph[step].add(dependency)

    steps_with_no_deps = set().union(*[deps for deps in graph.values()]) - set(graph.keys())

    for step in steps_with_no_deps:
        graph[step] = set()

    return graph


def part1(graph):
    steps_completed = ''

    while len(graph) > 0:
        (step, *_) = sorted([step for step, deps in graph.items() if len(deps) == 0])
        steps_completed += step
        del graph[step]

        for _, deps in graph.items():
            if step in deps:
                deps.remove(step)

    return steps_completed


def part2(graph):
    time_taken = 0
    num_workers = 0
    max_workers = 5
    in_progress = {}

    while len(graph) > 0:
        time_taken += 1
        next_steps = sorted([step for step, deps in graph.items()
                             if len(deps) == 0 and step not in in_progress])

        for step in next_steps:
            if num_workers == max_workers:
                break
            num_workers += 1
            in_progress[step] = ord(step) - ord('A') + 61

        for step in in_progress.keys():
            in_progress[step] -= 1

            if in_progress[step] == 0:
                num_workers -= 1
                del graph[step]

                for _, deps in graph.items():
                    if step in deps:
                        deps.remove(step)

    return time_taken
