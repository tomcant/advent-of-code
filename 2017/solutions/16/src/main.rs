use self::DanceMove::*;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

enum DanceMove {
    Spin(usize),
    Exchange(usize, usize),
    Partner(char, char),
}

fn parse_input(input: &str) -> Vec<DanceMove> {
    input
        .split(',')
        .map(|dance_move| {
            let (first_char, rest) = dance_move.split_at(1);
            let attrs: Vec<_> = rest.split('/').collect();

            match first_char {
                "s" => Spin(attrs[0].parse().expect("Spins")),
                "x" => Exchange(attrs[0].parse().expect("Exchange A"), attrs[1].parse().expect("Exchange B")),
                "p" => Partner(attrs[0].parse().expect("Partner A"), attrs[1].parse().expect("Partner B")),
                _ => panic!(),
            }
        })
        .collect()
}

fn part1(moves: Vec<DanceMove>) -> String {
    dance(&moves, "abcdefghijklmnop".to_owned())
}

fn part2(moves: Vec<DanceMove>) -> String {
    let initial = "abcdefghijklmnop".to_owned();
    let mut programs = initial.clone();
    let mut cycle = vec![initial.clone()];

    loop {
        programs = dance(&moves, programs);

        if programs == initial {
            break;
        }

        cycle.push(programs.clone());
    }

    cycle[1_000_000_000 % cycle.len()].clone()
}

fn dance(moves: &Vec<DanceMove>, programs: String) -> String {
    let mut programs: Vec<_> = programs.chars().collect();

    for m in moves {
        match m {
            Spin(spins) => programs.rotate_right(*spins),
            Exchange(a, b) => programs.swap(*a, *b),
            Partner(a, b) => {
                let a_idx = programs.iter().position(|c| c == a).expect("Partner A index");
                let b_idx = programs.iter().position(|c| c == b).expect("Partner B index");
                programs.swap(a_idx, b_idx)
            }
        }
    }

    programs.iter().collect()
}
