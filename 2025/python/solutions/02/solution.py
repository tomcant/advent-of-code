from re import match


def parse_input(input):
    return [(int(r.split("-")[0]), int(r.split("-")[1])) for r in input.split(",")]


def part1(input):
    return sum(
        id
        for r1, r2 in input
        for id in range(r1, r2 + 1)
        if match(r"^(.+)\1$", str(id))
    )


def part2(input):
    invalid_id_sum = 0

    for r1, r2 in input:
        for id in range(r1, r2 + 1):
            id_str = str(id)
            id_len = len(id_str)

            for chunk_len in range(1, id_len // 2 + 1):
                if id_len % chunk_len != 0:
                    continue

                chunks = [
                    id_str[i : i + chunk_len] for i in range(0, id_len, chunk_len)
                ]
                if len(set(chunks)) == 1:
                    invalid_id_sum += id
                    break

    return invalid_id_sum
