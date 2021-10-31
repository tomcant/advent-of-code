use std::collections::HashMap;
use std::ops::AddAssign;

#[derive(Copy, Clone, Eq, PartialEq, Hash)]
struct Vec2d(i32, i32);

impl Vec2d {
    fn rotate_right(point: Self) -> Self {
        Vec2d(-point.1, point.0)
    }

    fn rotate_left(point: Self) -> Self {
        Vec2d(point.1, -point.0)
    }

    fn rotate_180(point: Self) -> Self {
        Vec2d(-point.0, -point.1)
    }
}

impl AddAssign for Vec2d {
    fn add_assign(&mut self, point: Self) {
        *self = Self(self.0 + point.0, self.1 + point.1)
    }
}

#[derive(Copy, Clone, Eq, PartialEq)]
enum NodeState {
    Clean,
    Weakened,
    Infected,
    Flagged,
}

struct Grid {
    nodes: HashMap<Vec2d, NodeState>,
}

impl Grid {
    fn new() -> Self {
        Self {
            nodes: HashMap::new(),
        }
    }

    fn clean(&mut self, pos: Vec2d) {
        self.nodes.insert(pos, NodeState::Clean);
    }

    fn weaken(&mut self, pos: Vec2d) {
        self.nodes.insert(pos, NodeState::Weakened);
    }

    fn infect(&mut self, pos: Vec2d) {
        self.nodes.insert(pos, NodeState::Infected);
    }

    fn flag(&mut self, pos: Vec2d) {
        self.nodes.insert(pos, NodeState::Flagged);
    }

    fn get_node_state(&self, pos: Vec2d) -> NodeState {
        *self.nodes.get(&pos).unwrap_or(&NodeState::Clean)
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(&mut parse_input(input)));
    println!("Part 2: {}", part2(&mut parse_input(input)));
}

fn parse_input(input: &str) -> (Grid, Vec2d) {
    let lines: Vec<_> = input.lines().collect();
    let mut grid = Grid::new();

    for (y, line) in lines.iter().enumerate() {
        for (x, char) in line.chars().enumerate() {
            if char == '#' {
                grid.infect(Vec2d(x as i32, y as i32));
            }
        }
    }

    let centre = (lines.len() / 2) as i32;
    let origin = Vec2d(centre, centre);

    (grid, origin)
}

fn part1((grid, pos): &mut (Grid, Vec2d)) -> i32 {
    let mut dir = Vec2d(0, -1);
    let mut total_infections = 0;

    for _ in 0..10_000 {
        match grid.get_node_state(*pos) {
            NodeState::Clean => {
                total_infections += 1;
                dir = Vec2d::rotate_left(dir);
                grid.infect(*pos);
            }
            _ => {
                dir = Vec2d::rotate_right(dir);
                grid.clean(*pos);
            }
        }

        *pos += dir;
    }

    total_infections
}

fn part2((grid, pos): &mut (Grid, Vec2d)) -> i32 {
    let mut dir = Vec2d(0, -1);
    let mut total_infections = 0;

    for _ in 0..10_000_000 {
        match grid.get_node_state(*pos) {
            NodeState::Clean => {
                dir = Vec2d::rotate_left(dir);
                grid.weaken(*pos);
            }
            NodeState::Weakened => {
                total_infections += 1;
                grid.infect(*pos);
            }
            NodeState::Infected => {
                dir = Vec2d::rotate_right(dir);
                grid.flag(*pos);
            }
            NodeState::Flagged => {
                dir = Vec2d::rotate_180(dir);
                grid.clean(*pos);
            }
        }

        *pos += dir;
    }

    total_infections
}
