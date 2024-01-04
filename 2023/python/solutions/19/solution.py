from math import prod
from re import findall


def parse_input(input):
    workflows_raw, parts_raw = [group.splitlines() for group in input.split("\n\n")]
    workflows, parts = {}, []

    for workflow_raw in workflows_raw:
        [(name, rules)] = findall(r"(.+)\{(.+)\}", workflow_raw)

        workflows[name] = list(
            tuple(rule.split(":")) if ":" in rule else ("True", rule)
            for rule in rules.split(",")
        )

    for part_raw in parts_raw:
        parts.append(map(int, findall(r"\d+", part_raw)))

    return workflows, parts


def part1(input):
    workflows, parts = input
    accepted_parts = []

    for part in parts:
        x, m, a, s = part
        workflow = "in"

        while workflow in workflows:
            rules = workflows[workflow]

            for condition, dest in rules:
                if eval(condition):
                    workflow = dest
                    break

        if workflow == "A":
            accepted_parts.append([x, m, a, s])

    return sum(sum(part) for part in accepted_parts)


def part2(input):
    workflows, _ = input
    accepting_conditions = []

    for name, rules in workflows.items():
        for idx, (_, dest) in enumerate(rules):
            if dest == "A":
                conditions = find_conditions(name, workflows) + [
                    (rule, i == idx) for i, rule in enumerate(rules[: idx + 1])
                ]
                accepting_conditions.append(conditions)

    accepted_ratings = 0

    for conditions in accepting_conditions:
        ranges = {
            "x": [1, 4000],
            "m": [1, 4000],
            "a": [1, 4000],
            "s": [1, 4000],
        }

        for (condition, _), is_true in conditions:
            if condition == "True":
                continue

            category = condition[0]
            comparator = condition[1]
            value = int(condition[2:])

            match comparator:
                case "<":
                    if is_true:
                        ranges[category][1] = value - 1
                    else:
                        ranges[category][0] = value
                case ">":
                    if is_true:
                        ranges[category][0] = value + 1
                    else:
                        ranges[category][1] = value

        accepted_ratings += prod(
            [upper - lower + 1 for lower, upper in ranges.values()]
        )

    return accepted_ratings


def find_conditions(from_workflow, workflows):
    if from_workflow == "in":
        return []

    for name, rules in workflows.items():
        for idx, (_, dest) in enumerate(rules):
            if dest == from_workflow:
                return find_conditions(name, workflows) + [
                    (rule, i == idx) for i, rule in enumerate(rules[: idx + 1])
                ]
