fn main() {
    let input = std::include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<i32> {
    input.lines().map(|n| n.parse().unwrap()).collect()
}

fn part1(mut offsets: Vec<i32>) -> i32 {
    let mut steps = 0;
    let mut ptr: usize = 0;

    while ptr < offsets.len() {
        let inc = offsets[ptr];
        offsets[ptr] += 1;
        ptr += inc as usize;
        steps += 1;
    }

    steps
}

fn part2(mut offsets: Vec<i32>) -> i32 {
    let mut steps = 0;
    let mut ptr: usize = 0;

    while ptr < offsets.len() {
        let inc = offsets[ptr];
        offsets[ptr] += if inc >= 3 { -1 } else { 1 };
        ptr += inc as usize;
        steps += 1;
    }

    steps
}
