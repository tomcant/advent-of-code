def parse_input(input):
    return [tuple(map(int, line.split(","))) for line in input.splitlines()]


def part1(points):
    circuits = [{point} for point in points]
    connections_remaining = 1000

    for i, j in sorted_connections_by_distance(points):
        circuit_idxs = []
        for k, circuit in enumerate(circuits):
            if points[i] in circuit or points[j] in circuit:
                circuit.update({points[i], points[j]})
                circuit_idxs.append(k)

        if len(circuit_idxs) > 0:
            for idx in circuit_idxs[1:]:
                circuits[circuit_idxs[0]].update(circuits.pop(idx))
        else:
            circuits.append({points[i], points[j]})

        connections_remaining -= 1
        if connections_remaining == 0:
            break

    sizes = sorted((len(c) for c in circuits), reverse=True)
    return sizes[0] * sizes[1] * sizes[2]


def part2(points):
    circuits = [{point} for point in points]

    for i, j in sorted_connections_by_distance(points):
        circuit_idxs = []
        for k, circuit in enumerate(circuits):
            if points[i] in circuit or points[j] in circuit:
                circuit.update({points[i], points[j]})
                circuit_idxs.append(k)

        if len(circuit_idxs) > 0:
            for idx in circuit_idxs[1:]:
                circuits[circuit_idxs[0]].update(circuits.pop(idx))
        else:
            circuits.append({points[i], points[j]})

        if len(circuits) == 1:
            return points[i][0] * points[j][0]


def sorted_connections_by_distance(points):
    distances = []

    for i, (x1, y1, z1) in enumerate(points):
        for j, (x2, y2, z2) in enumerate(points[i + 1 :]):
            distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2) ** 0.5
            distances.append((distance, (i, j + i + 1)))

    return [connection for _, connection in sorted(distances)]
