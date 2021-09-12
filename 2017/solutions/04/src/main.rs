use std::collections::HashSet;
use std::iter::FromIterator;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<Vec<&str>> {
    input.lines().map(|line| line.split_whitespace().collect()).collect()
}

fn part1(passphrases: Vec<Vec<&str>>) -> i32 {
    passphrases.iter().fold(0, |cnt, p| {
        cnt + (p.len() == HashSet::<&str>::from_iter(p.iter().cloned()).len()) as i32
    })
}

fn part2(passphrases: Vec<Vec<&str>>) -> i32 {
    passphrases.iter().fold(0, |cnt, p| {
        cnt + (p.len() == HashSet::<String>::from_iter(p.iter().cloned().map(sort_chars)).len()) as i32
    })
}

fn sort_chars(word: &str) -> String {
    let mut chars: Vec<char> = word.chars().collect();
    chars.sort_by(|a, b| b.cmp(a));
    String::from_iter(chars)
}
