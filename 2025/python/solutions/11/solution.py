from functools import cache


def parse_input(input):
    devices = {}

    for line in input.splitlines():
        device, connections = line.split(": ")
        devices[device] = connections.split()

    return devices


def part1(devices):
    def search(device):
        return 1 if device == "out" else sum(map(search, devices[device]))

    return search("you")


def part2(devices):
    @cache
    def search(device, visited_dac, visited_fft):
        if device == "out":
            return 1 if visited_dac and visited_fft else 0

        return sum(
            search(
                connection,
                visited_dac or connection == "dac",
                visited_fft or connection == "fft",
            )
            for connection in devices[device]
        )

    return search("svr", visited_dac=False, visited_fft=False)
