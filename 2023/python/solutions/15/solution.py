from collections import defaultdict
from functools import reduce


def parse_input(input):
    return input.split(",")


def part1(steps):
    return sum(map(hash, steps))


def part2(steps):
    boxes = defaultdict(list)

    for step in steps:
        if step[-1] == "-":
            label = step[0:-1]
            box_num = hash(label)
            boxes[box_num] = list(
                filter(lambda lens: lens["label"] != label, boxes[box_num])
            )
        else:
            label, focal_len = step.split("=")
            box_num = hash(label)
            for lens in boxes[box_num]:
                if lens["label"] == label:
                    lens["focal_len"] = focal_len
                    break
            else:
                boxes[box_num].append(
                    {
                        "label": label,
                        "focal_len": focal_len,
                    }
                )

    return sum(
        sum(
            (idx + 1) * (slot + 1) * int(lens["focal_len"])
            for slot, lens in enumerate(box)
        )
        for idx, box in boxes.items()
    )


def hash(string):
    return reduce(lambda acc, char: 17 * (acc + ord(char)) % 256, string, 0)
