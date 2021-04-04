fn main() {
    let input = std::include_str!("input.txt");

    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<u32> {
    input.chars().map(|x| x.to_digit(10).unwrap()).collect()
}

fn part1(numbers: Vec<u32>) -> u32 {
    calc_sum(numbers, 1)
}

fn part2(numbers: Vec<u32>) -> u32 {
    let step = numbers.len() / 2;
    calc_sum(numbers, step)
}

fn calc_sum(numbers: Vec<u32>, step: usize) -> u32 {
    numbers
        .iter()
        .enumerate()
        .fold(0, |sum, (idx, num)| {
            if num == &numbers[(idx + step) % numbers.len()] {
                sum + num
            } else {
                sum
            }
        })
}
