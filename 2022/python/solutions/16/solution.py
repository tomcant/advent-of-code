from functools import cache
from re import match


def parse_input(input):
    graph = {}

    for line in input.splitlines():
        valve, rate, valves = match(r'Valve (\w+) .+ rate=(\d+); .+ valves? (.+)', line).groups()
        graph[valve] = {'rate': int(rate), 'valves': valves.split(', ')}

    return graph


def part1(graph):
    return find_max_pressure(graph, start='AA', total_time=30, total_turns=1)


def part2(graph):
    return find_max_pressure(graph, start='AA', total_time=26, total_turns=2)


def find_max_pressure(graph, start, total_time, total_turns):
    valve_idxs = dict(map(reversed, enumerate(graph)))

    def is_valve_closed(state, valve):
        return state & 1 << valve_idxs[valve] == 0

    def open_valve(state, valve):
        return state | 1 << valve_idxs[valve]

    @cache
    def search(state, valve, time_left, turns_left):
        if time_left == 0:
            if turns_left > 0:
                return search(state, start, total_time, turns_left - 1)
            return 0

        max_pressure = 0

        if graph[valve]['rate'] > 0 and is_valve_closed(state, valve):
            pressure = \
                graph[valve]['rate'] * (time_left - 1) + \
                search(open_valve(state, valve), valve, time_left - 1, turns_left)

            if pressure > max_pressure:
                max_pressure = pressure

        for next_valve in graph[valve]['valves']:
            pressure = search(state, next_valve, time_left - 1, turns_left)

            if pressure > max_pressure:
                max_pressure = pressure

        return max_pressure

    return search(0, start, total_time, total_turns - 1)
