use std::collections::HashMap;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> i32 {
    input.parse().unwrap()
}

fn part1(input: i32) -> i32 {
    let (mut x, mut y) = (0, 0);
    let (mut dx, mut dy) = (1, 0);

    let mut corners_reached = 0;
    let mut steps_to_corner = 1;

    let mut term = 1;

    loop {
        let steps = std::cmp::min(steps_to_corner, input - term);
        term += steps;
        x += dx * steps;
        y += dy * steps;

        if term == input {
            return x.abs() + y.abs();
        }

        corners_reached += 1;
        steps_to_corner += !corners_reached & 1;

        let old_dx = dx;
        dx = -dy;
        dy = old_dx;
    }
}

fn part2(input: i32) -> i32 {
    let (mut x, mut y) = (0, 0);
    let (mut dx, mut dy) = (1, 0);

    let mut corners_reached = 0;
    let mut steps_to_corner = 1;
    let mut steps_taken_to_corner = 0;

    let mut map = HashMap::new();
    map.insert((0, 0), 1);

    loop {
        x += dx;
        y += dy;

        let term = get_neighbour_positions(x, y)
            .iter()
            .fold(0, |sum, pos| sum + map.get(pos).unwrap_or(&0));

        if term > input {
            return term;
        }

        map.insert((x, y), term);

        steps_taken_to_corner += 1;

        if steps_taken_to_corner == steps_to_corner {
            corners_reached += 1;
            steps_to_corner += !corners_reached & 1;
            steps_taken_to_corner = 0;

            let old_dx = dx;
            dx = -dy;
            dy = old_dx;
        }
    }
}

fn get_neighbour_positions(x: i32, y: i32) -> Vec<(i32, i32)> {
    vec![
        (x, y - 1),
        (x, y + 1),
        (x - 1, y),
        (x - 1, y - 1),
        (x - 1, y + 1),
        (x + 1, y),
        (x + 1, y - 1),
        (x + 1, y + 1),
    ]
}
