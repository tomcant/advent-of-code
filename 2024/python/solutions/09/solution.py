from itertools import batched


def part1(input):
    input = map(int, input + "0")
    filesystem = []

    for file_id, (file_size, space_after_file) in enumerate(batched(input, 2)):
        filesystem += [file_id] * file_size + [None] * space_after_file

    new_filesystem = []
    for block in filesystem:
        if block == None:
            new_filesystem.append(filesystem.pop())
            while filesystem[-1] == None:
                filesystem.pop()
        else:
            new_filesystem.append(block)

    return checksum(new_filesystem)


def part2(input):
    input = map(int, input + "0")
    filesystem = []
    files = []
    space = []
    ptr = 0

    for file_id, (file_size, space_after_file) in enumerate(batched(input, 2)):
        filesystem += [file_id] * file_size + [None] * space_after_file

        files.append((ptr, file_size, file_id))
        ptr += file_size

        space.append((ptr, space_after_file))
        ptr += space_after_file

    for ptr, file_size, file_id in reversed(files):
        for space_idx, (space_ptr, space_size) in enumerate(space):
            if space_ptr >= ptr:
                break

            if file_size > space_size:
                continue

            filesystem[space_ptr : space_ptr + file_size] = [file_id] * file_size
            filesystem[ptr : ptr + file_size] = [None] * file_size

            space[space_idx] = (space_ptr + file_size, space_size - file_size)
            break

    return checksum(filesystem)


def checksum(filesystem):
    return sum(
        file_id * int(file_size) if file_size != None else 0
        for file_id, file_size in enumerate(filesystem)
    )
