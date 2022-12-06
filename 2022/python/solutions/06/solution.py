def part1(buffer): return find_marker_index(buffer, 4)
def part2(buffer): return find_marker_index(buffer, 14)


def find_marker_index(buffer, marker_len):
    for i in range(marker_len, len(buffer)):
        chars = buffer[i-marker_len:i]
        if len(set(chars)) == len(chars):
            return i
