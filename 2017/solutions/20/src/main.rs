use regex::Regex;
use std::cmp::PartialEq;
use std::collections::HashSet;
use std::ops::AddAssign;
use std::str::FromStr;

#[derive(Debug, Copy, Clone)]
struct Vec3d(i32, i32, i32);

impl Vec3d {
    fn manhattan_distance(&self) -> i32 {
        self.0.abs() + self.1.abs() + self.2.abs()
    }
}

impl PartialEq for Vec3d {
    fn eq(&self, v: &Self) -> bool {
        self.0 == v.0 && self.1 == v.1 && self.2 == v.2
    }
}

impl AddAssign for Vec3d {
    fn add_assign(&mut self, v: Self) {
        *self = Self(self.0 + v.0, self.1 + v.1, self.2 + v.2);
    }
}

impl FromStr for Vec3d {
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        let nums: Vec<_> = input.trim().split(',').map(|s| s.parse().expect("Vec3d part")).collect();
        Ok(Vec3d(nums[0], nums[1], nums[2]))
    }
}

#[derive(Debug, Copy, Clone)]
struct Particle {
    pos: Vec3d,
    vel: Vec3d,
    acc: Vec3d,
}

impl Particle {
    fn tick(&mut self) {
        self.vel += self.acc;
        self.pos += self.vel;
    }
}

impl FromStr for Particle {
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        let re = Regex::new(
            r"(?x)^
            p=<(?P<pos>.+?)>,\s
            v=<(?P<vel>.+?)>,\s
            a=<(?P<acc>.+?)>$",
        )
        .unwrap();

        let caps = re.captures(input).unwrap();
        let pos = caps.name("pos").unwrap().as_str().parse().expect("Parsed position");
        let vel = caps.name("vel").unwrap().as_str().parse().expect("Parsed velocity");
        let acc = caps.name("acc").unwrap().as_str().parse().expect("Parsed acceleration");

        Ok(Particle { pos, vel, acc })
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<Particle> {
    input.lines().map(|line| line.parse().expect("Parsed particle")).collect()
}

fn part1(particles: Vec<Particle>) -> usize {
    let mut particles = particles.clone();

    for _ in 0..500 {
        particles.iter_mut().for_each(|p| p.tick());
    }

    get_closest_particle_idx(&particles)
}

fn part2(particles: Vec<Particle>) -> usize {
    let mut particles = particles.clone();

    for _ in 0..500 {
        particles.iter_mut().for_each(|p| p.tick());
        remove_colliding_particles(&mut particles);
    }

    particles.len()
}

fn get_closest_particle_idx(particles: &Vec<Particle>) -> usize {
    get_particle_distances(&particles)
        .iter()
        .enumerate()
        .reduce(|closest, this| if this.1 < closest.1 { this } else { closest })
        .expect("Closest particle")
        .0
}

fn get_particle_distances(particles: &Vec<Particle>) -> Vec<i32> {
    particles.iter().map(|p| p.pos.manhattan_distance()).collect()
}

fn remove_colliding_particles(particles: &mut Vec<Particle>) {
    let mut idxs = HashSet::new();

    for i in 0..particles.len() - 1 {
        for j in i + 1..particles.len() {
            if particles[i].pos == particles[j].pos {
                idxs.insert(i);
                idxs.insert(j);
            }
        }
    }

    for idx in idxs {
        particles.swap_remove(idx);
    }
}
