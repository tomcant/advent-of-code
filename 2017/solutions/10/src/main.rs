fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(input));
    println!("Part 2: {}", part2(input));
}

fn part1(input: &str) -> u32 {
    let lengths = input.split(',').map(|s| s.parse().unwrap()).collect();
    let numbers = apply_twists(lengths, 1);

    numbers[0] as u32 * numbers[1] as u32
}

fn part2(input: &str) -> String {
    generate_knot_hash(input)
}

fn generate_knot_hash(input: &str) -> String {
    let lengths = [input.bytes().collect(), vec![17, 31, 73, 47, 23]].concat();

    generate_dense_hash(lengths)
        .iter()
        .map(|val| format!("{:02x}", val))
        .collect()
}

fn generate_dense_hash(lengths: Vec<u8>) -> Vec<u8> {
    generate_sparse_hash(lengths)
        .chunks(16)
        .map(|chunk| chunk.iter().fold(0, |acc, val| acc ^ val))
        .collect()
}

fn generate_sparse_hash(lengths: Vec<u8>) -> Vec<u8> {
    apply_twists(lengths, 64)
}

fn apply_twists(lengths: Vec<u8>, rounds: i32) -> Vec<u8> {
    let mut numbers: Vec<u8> = (0..=255).collect();
    let mut cur_pos = 0;
    let mut skip_size = 0;

    for _ in 0..rounds {
        for length in &lengths {
            if *length > 0 {
                let mut right = (cur_pos + *length as usize) % numbers.len();
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

            cur_pos += *length as usize + skip_size;
            cur_pos %= numbers.len();
            skip_size += 1;
        }
    }

    numbers
}
