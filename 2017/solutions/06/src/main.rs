use std::collections::HashMap;
use std::collections::HashSet;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<i32> {
    input.split_whitespace().map(|n| n.parse().unwrap()).collect()
}

fn part1(mut banks: Vec<i32>) -> i32 {
    let mut cycles = 0;
    let mut seen = HashSet::new();

    loop {
        cycles += 1;
        redistribute_largest_bank(&mut banks);

        let hash = hash_banks(&banks);

        if seen.contains(&hash) {
            return cycles;
        }

        seen.insert(hash);
    }
}

fn part2(mut banks: Vec<i32>) -> i32 {
    let mut cycles = 0;
    let mut seen = HashMap::new();

    loop {
        cycles += 1;
        redistribute_largest_bank(&mut banks);

        let hash = hash_banks(&banks);

        if seen.contains_key(&hash) {
            return cycles - seen.get(&hash).unwrap();
        }

        seen.insert(hash, cycles);
    }
}

fn redistribute_largest_bank(banks: &mut [i32]) {
    let index_of_largest_bank = find_index_of_largest_bank(&banks);
    let block_count = std::mem::replace(&mut banks[index_of_largest_bank], 0);

    for i in 0..block_count {
        banks[(index_of_largest_bank + 1 + i as usize) % banks.len()] += 1;
    }
}

fn find_index_of_largest_bank(banks: &[i32]) -> usize {
    banks.iter().enumerate().fold(0, |index, (i, &count)| if count > banks[index] { i } else { index })
}

fn hash_banks(banks: &[i32]) -> String {
    banks.iter().map(|&n| n.to_string() + ",").collect()
}
