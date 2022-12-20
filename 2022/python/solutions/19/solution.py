from functools import cache
from math import prod
from re import match


def parse_input(input):
    blueprints = []

    for line in input.splitlines():
        blueprint = []

        for type in ['ore', 'clay', 'obsidian', 'geode']:
            costs = match(f'Blueprint \d+: .+ {type} robot costs (?P<costs>[^\.]+)\.', line).group('costs')
            blueprint.append([int(cost) for cost in [cost.split(' ')[0] for cost in costs.split(' and ')]])

        blueprints.append(blueprint)

    return blueprints


def part1(blueprints):
    return sum(idx * find_max_opened_geodes(blueprint, total_time=24) for idx, blueprint in enumerate(blueprints, 1))


def part2(blueprints):
    return prod(find_max_opened_geodes(blueprint, total_time=32) for blueprint in blueprints[:3])


def find_max_opened_geodes(blueprint, total_time):
    (
        (ore_cost,), (clay_cost,),
        (obs_cost_ore, obs_cost_clay),
        (geode_cost_ore, geode_cost_obs),
    ) = blueprint

    max_ore_cost = max([
        ore_cost,
        clay_cost,
        obs_cost_ore,
        geode_cost_ore,
    ])

    @cache
    def search(
        time_left,
        ore=0, clay=0, obs=0,
        ore_rbts=1, clay_rbts=0, obs_rbts=0
    ):
        if time_left == 1:
            return 0

        time_left -= 1

        new_ore = ore + ore_rbts
        new_clay = clay + clay_rbts
        new_obs = obs + obs_rbts

        max_geodes = search(
            time_left,
            new_ore, new_clay, new_obs,
            ore_rbts, clay_rbts, obs_rbts
        )

        if ore >= ore_cost and ore_rbts < max_ore_cost:
            geodes = search(
                time_left,
                new_ore - ore_cost, new_clay, new_obs,
                ore_rbts + 1, clay_rbts, obs_rbts
            )
            if geodes > max_geodes: max_geodes = geodes

        if ore >= clay_cost and clay_rbts < obs_cost_clay:
            geodes = search(
                time_left,
                new_ore - clay_cost, new_clay, new_obs,
                ore_rbts, clay_rbts + 1, obs_rbts
            )
            if geodes > max_geodes: max_geodes = geodes

        if ore >= obs_cost_ore and clay >= obs_cost_clay and obs_rbts < geode_cost_obs:
            geodes = search(
                time_left,
                new_ore - obs_cost_ore, new_clay - obs_cost_clay, new_obs,
                ore_rbts, clay_rbts, obs_rbts + 1
            )
            if geodes > max_geodes: max_geodes = geodes

        if ore >= geode_cost_ore and obs >= geode_cost_obs:
            return time_left + \
                search(
                    time_left,
                    new_ore - geode_cost_ore, new_clay, new_obs - geode_cost_obs,
                    ore_rbts, clay_rbts, obs_rbts
                )

        return max_geodes

    return search(total_time)
