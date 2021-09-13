fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(input.split(",").map(|s| s.parse().unwrap()).collect()));
    println!("Part 2: {}", part2(input.chars().map(|s| (s as u8).into()).collect()));
}

fn part1(lengths: Vec<usize>) -> i32 {
    let numbers = apply_twists(lengths, 1);
    numbers[0] * numbers[1]
}

fn part2(mut lengths: Vec<usize>) -> String {
    lengths.extend_from_slice(&[17, 31, 73, 47, 23]);
    generate_knot_hash(lengths)
}

fn generate_knot_hash(lengths: Vec<usize>) -> String {
    generate_dense_hash(lengths).iter().map(|val| format!("{:02x}", val)).collect()
}

fn generate_dense_hash(lengths: Vec<usize>) -> Vec<i32> {
    generate_sparse_hash(lengths)
        .chunks(16)
        .map(|chunk| chunk.iter().fold(0, |acc, val| acc ^ val))
        .collect()
}

fn generate_sparse_hash(lengths: Vec<usize>) -> Vec<i32> {
    apply_twists(lengths, 64)
}

fn apply_twists(lengths: Vec<usize>, rounds: i32) -> Vec<i32> {
    let mut numbers: Vec<i32> = (0..=255).collect();
    let mut cur_pos = 0;
    let mut skip_size = 0;

    for _i in 0..rounds {
        for length in lengths.iter() {
            if *length > 0 {
                let mut right = (cur_pos + *length) % numbers.len();
                let mut rotate_by = 0;

                if right <= cur_pos {
                    rotate_by = right;
                    right = numbers.len();
                    cur_pos -= rotate_by;
                    numbers.rotate_left(rotate_by);
                }

                numbers[cur_pos..right].reverse();

                if rotate_by != 0 {
                    cur_pos += rotate_by;
                    numbers.rotate_right(rotate_by);
                }
            }

            cur_pos += *length + skip_size;
            cur_pos %= numbers.len();
            skip_size += 1;
        }
    }

    numbers
}
