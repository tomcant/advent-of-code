fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(input));
    println!("Part 2: {}", part2(input));
}

fn part1(stream: &str) -> i32 {
    let (score, _) = read_stream(stream);
    score
}

fn part2(stream: &str) -> i32 {
    let (_, garbage_count) = read_stream(stream);
    garbage_count
}

fn read_stream(stream: &str) -> (i32, i32) {
    let mut score = 0;
    let mut depth = 0;
    let mut garbage_count = 0;
    let mut is_garbage = false;
    let mut should_skip = false;

    for char in stream.chars() {
        if should_skip {
            should_skip = false;
            continue;
        }

        if is_garbage {
            garbage_count += 1;
        }

        match char {
            '{' => {
                if !is_garbage {
                    depth += 1;
                    score += depth;
                }
            },
            '}' => {
                if !is_garbage {
                    depth -= 1;
                }
            },
            '<' => is_garbage = true,
            '>' => {
                is_garbage = false;
                garbage_count -= 1;
            },
            '!' => {
                should_skip = true;
                garbage_count -= 1;
            },
            _ => (),
        };
    }

    (score, garbage_count)
}
