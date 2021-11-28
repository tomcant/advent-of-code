use std::collections::HashMap;
use std::collections::VecDeque;

type Register = char;
type Registers = HashMap<Register, i64>;

#[derive(Clone)]
enum Value {
    Number(i64),
    FromRegister(Register),
}

#[derive(Clone)]
enum Instruction {
    Snd(Value),
    Rcv(Register),
    Set(Register, Value),
    Add(Register, Value),
    Mul(Register, Value),
    Mod(Register, Value),
    Jgz(Value, Value),
}

type Program = Vec<Instruction>;
type IoContainer = VecDeque<i64>;

struct Runtime {
    registers: Registers,
    program: Program,
    ptr: usize,
}

impl Runtime {
    fn new(program: Program) -> Self {
        Self {
            registers: Registers::new(),
            program,
            ptr: 0,
        }
    }

    fn resolve(&self, val: &Value) -> i64 {
        match val {
            Value::Number(num) => *num,
            Value::FromRegister(r) => *self.registers.get(r).expect("Register value"),
        }
    }

    fn step(&mut self, input: &mut IoContainer, output: &mut IoContainer) -> Option<&Instruction> {
        match &self.program[self.ptr] {
            Instruction::Set(x, y) => {
                self.registers.insert((*x).clone(), self.resolve(y));
            }
            Instruction::Add(x, y) => {
                *self.registers.entry((*x).clone()).or_insert(0) += self.resolve(y);
            }
            Instruction::Mul(x, y) => {
                *self.registers.entry((*x).clone()).or_insert(0) *= self.resolve(y);
            }
            Instruction::Mod(x, y) => {
                *self.registers.entry((*x).clone()).or_insert(0) %= self.resolve(y);
            }
            Instruction::Snd(x) => {
                output.push_back(self.resolve(x));
            }
            Instruction::Rcv(x) => {
                if input.len() == 0 {
                    return None;
                }
                self.registers
                    .insert((*x).clone(), input.pop_front().expect("Next input"));
            }
            Instruction::Jgz(x, y) => {
                if self.resolve(x) > 0 {
                    self.ptr += self.resolve(y) as usize - 1;
                }
            }
        };

        self.ptr += 1;

        Some(&self.program[self.ptr - 1])
    }
}

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Program {
    fn to_register(str: &str) -> Register {
        str.chars().next().expect("Parsed register")
    }

    fn to_value(str: &str) -> Value {
        match str.parse::<i64>() {
            Ok(num) => Value::Number(num),
            _ => Value::FromRegister(to_register(str)),
        }
    }

    input
        .lines()
        .map(|line| {
            let parts: Vec<_> = line.split_whitespace().collect();

            match parts[0] {
                "snd" => Instruction::Snd(to_value(parts[1])),
                "rcv" => Instruction::Rcv(to_register(parts[1])),
                "set" => Instruction::Set(to_register(parts[1]), to_value(parts[2])),
                "add" => Instruction::Add(to_register(parts[1]), to_value(parts[2])),
                "mul" => Instruction::Mul(to_register(parts[1]), to_value(parts[2])),
                "mod" => Instruction::Mod(to_register(parts[1]), to_value(parts[2])),
                "jgz" => Instruction::Jgz(to_value(parts[1]), to_value(parts[2])),
                _ => panic!(),
            }
        })
        .collect()
}

fn part1(program: Program) -> i64 {
    let mut runtime = Runtime::new(program);
    let mut io = IoContainer::new();

    loop {
        if let Some(instruction) = runtime.step(&mut io.clone(), &mut io) {
            if let Instruction::Rcv(_) = instruction {
                return *io.back().expect("Last output");
            }
        }
    }
}

fn part2(program: Program) -> i64 {
    let mut first = Runtime::new(program.clone());
    first.registers.insert('p', 0);

    let mut second = Runtime::new(program.clone());
    second.registers.insert('p', 1);

    let mut input = IoContainer::new();
    let mut output = IoContainer::new();

    let mut sent_count = 0;

    loop {
        let mut did_something = false;

        loop {
            if let None = first.step(&mut input, &mut output) {
                break;
            }
            did_something = true;
        }

        while let Some(instruction) = second.step(&mut output, &mut input) {
            if let Instruction::Snd(_) = instruction {
                sent_count += 1;
            }
            did_something = true;
        }

        if !did_something {
            break;
        }
    }

    sent_count
}
