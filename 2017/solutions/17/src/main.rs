fn main() {
    let input = include_str!("input.txt").parse().expect("Steps");
    println!("Part 1: {}", part1(input));
    println!("Part 2: {}", part2(input));
}

fn part1(steps: usize) -> i32 {
    let mut buffer = vec![0];
    let mut pos = 0;

    for next_val in 1..=2017 {
        pos = next_pos(pos, steps, buffer.len());
        buffer.insert(pos, next_val);
    }

    buffer[pos + 1]
}

fn part2(steps: usize) -> i32 {
    let mut result = 0;
    let mut pos = 0;

    for next_val in 1..=50_000_000 {
        pos = next_pos(pos, steps, next_val);

        if pos == 1 {
            result = next_val;
        }
    }

    result as i32
}

fn next_pos(cur_pos: usize, steps: usize, divisor: usize) -> usize {
    (cur_pos + steps) % divisor + 1
}
