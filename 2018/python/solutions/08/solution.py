def parse_input(input):
    license = list(map(int, input.split()))

    def build_tree_at(start):
        num_children, num_metadata = license[start:start+2]
        children = []
        ptr = start + 2

        for _ in range(num_children):
            subtree, len = build_tree_at(ptr)
            children.append(subtree)
            ptr += len

        metadata = license[ptr:ptr+num_metadata]
        len = num_metadata + ptr - start

        return (children, metadata), len

    tree, _ = build_tree_at(0)
    return tree


def part1(tree):
    children, metadata = tree
    return sum(metadata, sum(part1(child) for child in children))


def part2(tree):
    children, metadata = tree
    if len(children) == 0:
        return sum(metadata)
    return sum(part2(children[i - 1]) for i in metadata if i <= len(children))
