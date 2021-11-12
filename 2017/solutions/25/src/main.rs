use regex::Regex;
use std::collections::HashMap;
use std::collections::HashSet;

type State = char;

struct Transition {
    write: i32,
    move_by: i32,
    next: State,
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
}

fn parse_input(input: &str) -> (State, i32, HashMap<State, [Transition; 2]>) {
    let re_state = Regex::new(r"state (?P<state>[A-Z])").unwrap();
    let re_number = Regex::new(r"(?P<number>\d+)").unwrap();
    let re_direction = Regex::new(r"(?P<direction>(left|right))").unwrap();

    let parse_state = |s: &str| -> State {
        let caps = re_state.captures(s).unwrap();
        caps.name("state").unwrap().as_str().chars().nth(0).unwrap()
    };

    let parse_number = |s: &str| -> i32 {
        let caps = re_number.captures(s).unwrap();
        caps.name("number").unwrap().as_str().parse().unwrap()
    };

    let parse_direction = |s: &str| -> i32 {
        let caps = re_direction.captures(s).unwrap();
        let direction = caps.name("direction").unwrap().as_str();

        if direction == "left" {
            -1
        } else {
            1
        }
    };

    let parse_transition = |lines: &[&str]| -> Transition {
        Transition {
            write: parse_number(lines[0]),
            move_by: parse_direction(lines[1]),
            next: parse_state(lines[2]),
        }
    };

    let groups: Vec<_> = input.split("\n\n").collect();
    let first_group: Vec<_> = groups[0].lines().collect();

    (
        parse_state(first_group[0]),
        parse_number(first_group[1]),
        groups[1..]
            .iter()
            .map(|group| {
                let group: Vec<_> = group.lines().collect();
                (
                    parse_state(group[0]),
                    [
                        parse_transition(&group[2..=4]),
                        parse_transition(&group[6..=8]),
                    ],
                )
            })
            .collect(),
    )
}

fn part1(input: (State, i32, HashMap<State, [Transition; 2]>)) -> usize {
    let (mut state, steps, transitions) = input;
    let mut tape = HashSet::new();
    let mut cursor = 0;

    for _ in 0..steps {
        let cur_val = if tape.contains(&cursor) { 1 } else { 0 };
        let transition = &transitions.get(&state).unwrap()[cur_val];

        if transition.write == 1 {
            tape.insert(cursor);
        } else if cur_val == 1 {
            tape.remove(&cursor);
        }

        cursor += transition.move_by;
        state = transition.next;
    }

    tape.len()
}
