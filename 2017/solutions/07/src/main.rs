use regex::Regex;
use std::collections::HashMap;

#[derive(Debug)]
struct Node<'a> {
    weight: i32,
    parent: Option<&'a str>,
    children: Vec<&'a str>,
}

impl<'a> Node<'a> {
    fn new(weight: i32, children: Vec<&'a str>) -> Self {
        Self {
            weight,
            parent: None,
            children,
        }
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> HashMap<&str, Node> {
    let mut nodes = HashMap::new();
    let mut parents = HashMap::<&str, &str>::new();

    let re = Regex::new(r"^(?P<name>\w+)\s\((?P<weight>[0-9]+)\)(\s->\s(?P<children>.+))?$").unwrap();

    for line in input.lines() {
        let caps = re.captures(line).unwrap();
        let name = caps.name("name").unwrap().as_str();
        let weight = caps.name("weight").unwrap().as_str().parse::<i32>().unwrap();
        let children = caps.name("children").map_or(vec![], |m| m.as_str().split(", ").collect());

        for child in children.iter() {
            parents.insert(child, name);
        }

        nodes.insert(name, Node::new(weight, children));
    }

    for (name, node) in nodes.iter_mut() {
        if parents.contains_key(name) {
            node.parent = Some(parents.get(name).unwrap());
        }
    }

    nodes
}

fn part1<'a>(nodes: HashMap<&'a str, Node>) -> &'a str {
    find_root_name(&nodes)
}

fn part2(nodes: HashMap<&str, Node>) -> i32 {
    let root_name = find_root_name(&nodes);
    let (imbalanced_name, correction) = find_balance_correction(root_name, &nodes).unwrap();

    nodes.get(imbalanced_name).unwrap().weight + correction
}

fn find_root_name<'a>(nodes: &HashMap<&'a str, Node>) -> &'a str {
    nodes.iter().find(|(_, node)| node.parent == None).unwrap().0
}

fn find_balance_correction<'a>(node_name: &'a str, nodes: &'a HashMap<&str, Node>) -> Option<(&'a str, i32)> {
    let node = nodes.get(node_name).unwrap();
    let mut weight_counts = HashMap::<i32, i32>::new();
    let mut subtree_weights = HashMap::<&str, i32>::new();

    for child in node.children.iter() {
        let weight = get_subtree_weight(child, &nodes);
        *weight_counts.entry(weight).or_insert(0) += 1;
        subtree_weights.insert(child, weight);
    }

    if weight_counts.len() == 1 {
        return None;
    }

    let imbalanced_weight = find_key_for_value(&weight_counts, 1).unwrap();
    let imbalanced_name = find_key_for_value(&subtree_weights, *imbalanced_weight).unwrap();
    let correction = find_balance_correction(imbalanced_name, &nodes);

    if correction == None {
        let correct_weight = subtree_weights.values().find(|val| *val != imbalanced_weight).unwrap();

        return Some((imbalanced_name, correct_weight - imbalanced_weight));
    }

    correction
}

fn get_subtree_weight(node_name: &str, nodes: &HashMap<&str, Node>) -> i32 {
    let node = nodes.get(node_name).unwrap();

    node.children.iter().fold(node.weight, |acc, child| acc + get_subtree_weight(child, nodes))
}

fn find_key_for_value<K, V: std::cmp::PartialEq>(map: &HashMap<K, V>, value: V) -> Option<&K> {
    Some(map.iter().find(|(_, val)| **val == value).unwrap().0)
}
