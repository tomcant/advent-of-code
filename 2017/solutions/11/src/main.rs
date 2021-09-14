use std::ops::Add;

// Thanks to this incredible resource: https://www.redblobgames.com/grids/hexagons

struct Vec2d(i32, i32);

impl Vec2d {
    fn origin() -> Self {
        Self(0, 0)
    }

    fn from_dir(dir: &str) -> Self {
        match dir {
            "n" => Self(0, 1),
            "s" => Self(0, -1),
            "ne" => Self(1, 0),
            "se" => Self(1, -1),
            "nw" => Self(-1, 1),
            "sw" => Self(-1, 0),
            _ => panic!(),
        }
    }

    fn dist_from_origin(&self) -> i32 {
        (self.0.abs() + self.1.abs() + (self.0 + self.1).abs()) / 2
    }
}

impl Add for Vec2d {
    type Output = Self;

    fn add(self, other: Vec2d) -> Vec2d {
        Vec2d(self.0 + other.0, self.1 + other.1)
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<&str> {
    input.split(",").collect()
}

fn part1(path: Vec<&str>) -> i32 {
    path.iter().fold(Vec2d::origin(), |pos, dir| pos + Vec2d::from_dir(dir)).dist_from_origin()
}

fn part2(path: Vec<&str>) -> i32 {
    let (max_dist, _) = path.iter().fold((0, Vec2d::origin()), |(max_dist, pos), dir| {
        let next_pos = pos + Vec2d::from_dir(dir);
        let dist = next_pos.dist_from_origin();
        (i32::max(dist, max_dist), next_pos)
    });

    max_dist
}
