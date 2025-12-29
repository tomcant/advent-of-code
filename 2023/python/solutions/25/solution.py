import random


def parse_input(input):
    nodes = set()
    edges = set()

    for line in input.splitlines():
        node, connections = line.split(":")
        nodes.add(node)

        for connection in connections.split():
            edges.add(tuple(sorted((node, connection))))
            nodes.add(connection)

    idx = {n: i for i, n in enumerate(nodes)}
    edges = [(idx[u], idx[v]) for u, v in edges]
    return len(nodes), edges


def part1(input):
    n_nodes, edges = input
    a, b = karger_min_cut(n_nodes, edges, target_cut=3)
    return a * b


# Karger's algorithm: https://en.wikipedia.org/wiki/Karger%27s_algorithm
def karger_min_cut(n_nodes, edges, target_cut=3):
    rng = random.Random()
    n_edges = len(edges)

    while True:
        roots = list(range(n_nodes))
        rank = [0] * n_nodes
        size = [1] * n_nodes
        components = n_nodes

        while components > 2:
            u, v = edges[rng.randrange(n_edges)]
            ru = find_root_of(u, roots)
            rv = find_root_of(v, roots)
            if ru == rv:
                continue
            union(roots, rank, size, ru, rv)
            components -= 1

        # Identify the two component roots.
        r0 = find_root_of(0, roots)
        r1 = r0
        for i in range(1, n_nodes):
            ri = find_root_of(i, roots)
            if ri != r0:
                r1 = ri
                break

        # Count crossing edges, but stop as soon as we exceed target_cut.
        cut = 0
        for u, v in edges:
            if find_root_of(u, roots) != find_root_of(v, roots):
                cut += 1
                if cut > target_cut:
                    break

        if cut == target_cut:
            return size[r0], size[r1]


def find_root_of(node, roots):
    while roots[node] != node:
        roots[node] = roots[roots[node]]
        node = roots[node]
    return node


def union(roots, rank, size, ra, rb):
    roots[rb] = ra
    size[ra] += size[rb]
    if rank[ra] == rank[rb]:
        rank[ra] += 1
