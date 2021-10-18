use std::collections::HashMap;
use std::ops::{Add, AddAssign};

#[derive(Copy, Clone, Eq, PartialEq, Hash)]
struct Vec2d(i32, i32);

impl Vec2d {
    fn rotate_left(point: Self) -> Self {
        Vec2d(-point.1, point.0)
    }

    fn rotate_right(point: Self) -> Self {
        Vec2d(point.1, -point.0)
    }
}

impl Add for Vec2d {
    type Output = Self;

    fn add(self, point: Self) -> Self {
        Self(self.0 + point.0, self.1 + point.1)
    }
}

impl AddAssign for Vec2d {
    fn add_assign(&mut self, point: Self) {
        *self = *self + point;
    }
}

type Grid = HashMap<Vec2d, char>;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Grid {
    let mut grid = Grid::new();

    for (y, line) in input.lines().enumerate() {
        for (x, c) in line.chars().enumerate() {
            if c != ' ' {
                grid.insert(Vec2d(x as i32, y as i32), c);
            }
        }
    }

    grid
}

fn part1(grid: Grid) -> String {
    let mut letters = String::from("");
    let mut pos = find_start_pos(&grid).clone();
    let mut dir = Vec2d(0, 1);

    while grid.contains_key(&pos) {
        let cur = grid.get(&pos).expect("Current pos");

        match cur {
            'A'..='Z' => letters.push(*cur),
            '+' => dir = get_next_dir(&grid, pos, dir),
            _ => (),
        }

        pos += dir;
    }

    letters
}

fn part2(grid: Grid) -> i32 {
    let mut steps = 0;
    let mut pos = find_start_pos(&grid).clone();
    let mut dir = Vec2d(0, 1);

    while grid.contains_key(&pos) {
        if *grid.get(&pos).expect("Current pos") == '+' {
            dir = get_next_dir(&grid, pos, dir);
        }

        pos += dir;
        steps += 1;
    }

    steps
}

fn find_start_pos(grid: &Grid) -> Vec2d {
    *grid.keys().find(|Vec2d(_, y)| *y == 0).expect("Start pos")
}

fn get_next_dir(grid: &Grid, cur_pos: Vec2d, cur_dir: Vec2d) -> Vec2d {
    let left = Vec2d::rotate_left(cur_dir);
    let pos_left = cur_pos + left;

    if grid.contains_key(&pos_left) {
        return left;
    }

    Vec2d::rotate_right(cur_dir)
}
