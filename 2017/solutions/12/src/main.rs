use std::collections::HashMap;
use std::collections::HashSet;
use std::collections::VecDeque;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> HashMap<i32, Vec<i32>> {
    input
        .lines()
        .map(|line| {
            let mut parts = line.split("<->");
            (
                parts.next().unwrap().trim().parse().unwrap(),
                parts.next().unwrap().split(",").map(|s| s.trim().parse().unwrap()).collect(),
            )
        })
        .collect()
}

fn part1(programs: HashMap<i32, Vec<i32>>) -> i32 {
    discover_group(0, &programs).len() as i32
}

fn part2(programs: HashMap<i32, Vec<i32>>) -> i32 {
    let mut total_groups = 0;
    let mut seen = HashSet::new();
    let keys: HashSet<i32> = programs.keys().cloned().collect();

    while seen.len() < keys.len() {
        seen.extend(&discover_group(*(&keys - &seen).iter().next().unwrap(), &programs));
        total_groups += 1;
    }

    total_groups
}

fn discover_group(program: i32, programs: &HashMap<i32, Vec<i32>>) -> HashSet<i32> {
    let mut group = HashSet::new();
    let mut queue = VecDeque::new();

    queue.push_back(program);

    while !queue.is_empty() {
        let p = queue.pop_front().unwrap();

        if group.contains(&p) {
            continue;
        }

        group.insert(p);

        for connection in programs.get(&p).unwrap().iter() {
            queue.push_back(*connection);
        }
    }

    group
}
