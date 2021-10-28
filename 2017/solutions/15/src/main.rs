use regex::Regex;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> (u64, u64) {
    let re = Regex::new(r"(\d+)$").unwrap();
    let pluck = |s| {
        re.captures(s)
            .unwrap()
            .get(0)
            .unwrap()
            .as_str()
            .parse()
            .unwrap()
    };

    let mut lines = input.lines();
    (pluck(lines.next().unwrap()), pluck(lines.next().unwrap()))
}

fn part1((a, b): (u64, u64)) -> u32 {
    duel((a, 1), (b, 1), 40_000_000)
}

fn part2((a, b): (u64, u64)) -> u32 {
    duel((a, 4), (b, 8), 5_000_000)
}

fn duel(initial_a: (u64, u64), initial_b: (u64, u64), rounds: u32) -> u32 {
    let (mut last_a, multiplier_a) = initial_a;
    let (mut last_b, multiplier_b) = initial_b;

    let mut matches = 0;

    for _ in 0..rounds {
        last_a = generate_next(last_a, 16807, multiplier_a);
        last_b = generate_next(last_b, 48271, multiplier_b);

        if last_a as u16 == last_b as u16 {
            matches += 1;
        }
    }

    matches
}

fn generate_next(mut last: u64, multiplier: u64, factor: u64) -> u64 {
    loop {
        last = (last * multiplier) % 2147483647;

        if last % factor == 0 {
            return last;
        }
    }
}
