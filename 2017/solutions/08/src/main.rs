use regex::Regex;
use std::collections::HashMap;
use std::str::FromStr;

#[derive(Debug)]
enum Operator {
    Inc,
    Dec,
}

impl FromStr for Operator {
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        match input {
            "inc" => Ok(Self::Inc),
            "dec" => Ok(Self::Dec),
            _ => Err(()),
        }
    }
}

#[derive(Debug)]
struct Instruction<'a> {
    lhs: &'a str,
    op: Operator,
    rhs: i32,
}

// We can't use the `FromStr` trait here because the lifetime of the `input` parameter below is
// required to be at least that of the returned `Instruction` (see the `lhs` field), and we can't
// control this lifetime since the `from_str()` method signature is prescribed by that trait.
impl<'a> From<&'a str> for Instruction<'a> {
    fn from(input: &'a str) -> Instruction<'a> {
        let re = Regex::new(r"(?P<lhs>\w+)\s(?P<op>inc|dec)\s(?P<rhs>-?\d+)").unwrap();
        let caps = re.captures(input).unwrap();
        let lhs = caps.name("lhs").unwrap().as_str();
        let op = caps.name("op").unwrap().as_str().parse().unwrap();
        let rhs = caps.name("rhs").unwrap().as_str().parse().unwrap();

        Self { lhs, op, rhs }
    }
}

impl<'a> Instruction<'a> {
    fn apply(&self, registers: &mut HashMap<&'a str, i32>) {
        let register = registers.entry(self.lhs).or_insert(0);

        match self.op {
            Operator::Inc => *register += self.rhs,
            Operator::Dec => *register -= self.rhs,
        };
    }
}

#[derive(Debug)]
enum Equality {
    Equal,
    NotEqual,
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
}

impl FromStr for Equality {
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        match input {
            "==" => Ok(Self::Equal),
            "!=" => Ok(Self::NotEqual),
            "<" => Ok(Self::LessThan),
            "<=" => Ok(Self::LessThanOrEqual),
            ">" => Ok(Self::GreaterThan),
            ">=" => Ok(Self::GreaterThanOrEqual),
            _ => Err(()),
        }
    }
}

#[derive(Debug)]
struct Condition<'a> {
    lhs: &'a str,
    eq: Equality,
    rhs: i32,
}

impl<'a> From<&'a str> for Condition<'a> {
    fn from(input: &'a str) -> Self {
        let re = Regex::new(r"(?P<lhs>\w+)\s(?P<eq>[=!><]{1,2})\s(?P<rhs>-?\d+)").unwrap();
        let caps = re.captures(input).unwrap();
        let lhs = caps.name("lhs").unwrap().as_str();
        let eq = caps.name("eq").unwrap().as_str().parse().unwrap();
        let rhs = caps.name("rhs").unwrap().as_str().parse().unwrap();

        Self { lhs, eq, rhs }
    }
}

impl Condition<'_> {
    fn test(&self, registers: &HashMap<&str, i32>) -> bool {
        let register_val = registers.get(self.lhs).unwrap_or(&0);

        match self.eq {
            Equality::Equal => *register_val == self.rhs,
            Equality::NotEqual => *register_val != self.rhs,
            Equality::LessThan => *register_val < self.rhs,
            Equality::LessThanOrEqual => *register_val <= self.rhs,
            Equality::GreaterThan => *register_val > self.rhs,
            Equality::GreaterThanOrEqual => *register_val >= self.rhs,
        }
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<(Instruction, Condition)> {
    input
        .lines()
        .map(|line| {
            let parts = line.split(" if ").collect::<Vec<&str>>();
            (parts[0].into(), parts[1].into())
        })
        .collect()
}

fn part1(lines: Vec<(Instruction, Condition)>) -> i32 {
    let mut registers = HashMap::<&str, i32>::new();

    for (instruction, condition) in lines.iter() {
        if condition.test(&registers) {
            instruction.apply(&mut registers);
        }
    }

    *registers.values().max().unwrap()
}

fn part2(lines: Vec<(Instruction, Condition)>) -> i32 {
    let mut registers = HashMap::<&str, i32>::new();
    let mut max_register = 0;

    for (instruction, condition) in lines.iter() {
        if condition.test(&registers) {
            instruction.apply(&mut registers);
            let max = registers.values().max().unwrap();
            max_register = if *max > max_register { *max } else { max_register };
        }
    }

    max_register
}
