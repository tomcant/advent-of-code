type Component = (usize, usize);
type BridgeStats = (usize, usize);
type BridgeComparator = fn(_: BridgeStats, _: BridgeStats) -> bool;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<Component> {
    input
        .lines()
        .map(|line| {
            let ports: Vec<_> = line.split('/').collect();
            (
                ports[0].parse().expect("First port"),
                ports[1].parse().expect("Second port"),
            )
        })
        .collect()
}

fn part1(components: Vec<Component>) -> usize {
    let (_, strength) = find_strongest_bridge_by(&components, |a, b| a.1 > b.1);
    strength
}

fn part2(components: Vec<Component>) -> usize {
    let (_, strength) = find_strongest_bridge_by(&components, |a, b| match a.0 == b.0 {
        true => a.1 > b.1,
        false => a.0 > b.0,
    });
    strength
}

fn find_strongest_bridge_by(
    components: &Vec<Component>,
    comparator: BridgeComparator,
) -> BridgeStats {
    fn find(
        components: &Vec<Component>,
        comparator: BridgeComparator,
        port: usize,
        bridge: &Vec<Component>,
    ) -> BridgeStats {
        let matching_components = find_matching_components(&components, port);

        if matching_components.len() == 0 {
            return to_bridge_stats(&bridge);
        }

        let mut best_stats = (0, 0);

        for component in matching_components {
            let mut next_bridge = bridge.clone();
            next_bridge.push(component);

            let stats = find(
                &get_components_excluding(&components, component),
                comparator,
                component.1,
                &next_bridge,
            );

            if comparator(stats, best_stats) {
                best_stats = stats;
            }
        }

        best_stats
    }

    find(&components, comparator, 0, &vec![])
}

fn find_matching_components(components: &Vec<Component>, port: usize) -> Vec<Component> {
    let mut matches = vec![];

    for (p0, p1) in components {
        if *p0 == port {
            matches.push((*p0, *p1));
        }
        if *p1 == port {
            matches.push((*p1, *p0));
        }
    }

    matches
}

fn get_components_excluding(components: &Vec<Component>, component: Component) -> Vec<Component> {
    let mut new_components = vec![];
    let mut excluded = false;

    for (p0, p1) in components {
        if !excluded
            && ((*p0 == component.0 && *p1 == component.1)
                || *p0 == component.1 && *p1 == component.0)
        {
            excluded = true;
            continue;
        }
        new_components.push((*p0, *p1));
    }

    new_components
}

fn to_bridge_stats(bridge: &Vec<Component>) -> BridgeStats {
    (
        bridge.len(),
        bridge
            .iter()
            .fold(0, |strength, (p0, p1)| strength + p0 + p1),
    )
}
