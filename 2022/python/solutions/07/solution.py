def parse_input(input):
    shell_output = input.splitlines()

    def build_dir(start):
        content = {}
        ptr = start + 2

        while True:
            line = shell_output[ptr]

            if line.startswith('$ cd'):
                dir_name = line.split()[-1]
                if dir_name == '..':
                    break
                dir, ptr_skip = build_dir(ptr)
                content[dir_name] = dir
                ptr += ptr_skip
            elif not line.startswith('dir'):
                size, file_name = line.split()
                content[file_name] = int(size)

            ptr += 1
            if ptr >= len(shell_output):
                break

        return content, ptr - start

    filesystem, _ = build_dir(0)
    return filesystem


def part1(filesystem):
    return sum(size for size in calc_all_dir_sizes(filesystem) if size < 100_000)


def part2(filesystem):
    free_space = 70_000_000 - calc_dir_size(filesystem)
    space_to_be_freed = 30_000_000 - free_space

    return min(size for size in calc_all_dir_sizes(filesystem) if size > space_to_be_freed)


def calc_all_dir_sizes(filesystem):
    sizes = []

    for dir in filter(is_dir, filesystem.values()):
        sizes += [*calc_all_dir_sizes(dir), calc_dir_size(dir)]

    return sizes


def calc_dir_size(filesystem):
    return sum(calc_dir_size(item) if is_dir(item) else item for item in filesystem.values())


def is_dir(item): return type(item) is dict
