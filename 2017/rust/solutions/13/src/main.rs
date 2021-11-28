use itertools::Itertools;
use std::collections::HashMap;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> HashMap<i32, i32> {
    input
        .lines()
        .map(|line| {
            line.split(": ")
                .map(|s| s.parse().unwrap())
                .collect_tuple()
                .unwrap()
        })
        .collect()
}

fn part1(firewall: HashMap<i32, i32>) -> i32 {
    firewall.iter().fold(0, |severity, (depth, range)| {
        severity
            + if is_not_caught(*depth, *range) {
                0
            } else {
                depth * range
            }
    })
}

fn part2(firewall: HashMap<i32, i32>) -> i32 {
    (0..)
        .find(|delay| {
            firewall
                .iter()
                .all(|(depth, range)| is_not_caught(depth + delay, *range))
        })
        .unwrap()
}

fn is_not_caught(depth: i32, range: i32) -> bool {
    depth % (2 * (range - 1)) > 0
}
