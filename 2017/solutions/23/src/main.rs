use std::collections::HashMap;

type Register = char;
type Registers = HashMap<Register, i64>;

#[derive(Clone)]
enum Value {
    Number(i64),
    FromRegister(Register),
}

#[derive(Clone)]
enum Instruction {
    Set(Register, Value),
    Sub(Register, Value),
    Mul(Register, Value),
    Jnz(Value, Value),
    Jpr(Value, Value), // Jump if prime
}

type Program = Vec<Instruction>;

struct Runtime {
    registers: Registers,
    program: Program,
    ptr: usize,
    mul_count: u32,
}

impl Runtime {
    fn new(program: Program, registers: Registers) -> Self {
        Self {
            registers,
            program,
            ptr: 0,
            mul_count: 0,
        }
    }

    fn resolve(&self, val: &Value) -> i64 {
        match val {
            Value::Number(num) => *num,
            Value::FromRegister(r) => *self.registers.get(r).unwrap_or(&0),
        }
    }

    fn execute(&mut self) {
        while self.ptr < self.program.len() {
            match &self.program[self.ptr] {
                Instruction::Set(x, y) => {
                    self.registers.insert((*x).clone(), self.resolve(y));
                }
                Instruction::Sub(x, y) => {
                    *self.registers.entry((*x).clone()).or_insert(0) -= self.resolve(y);
                }
                Instruction::Mul(x, y) => {
                    *self.registers.entry((*x).clone()).or_insert(0) *= self.resolve(y);
                    self.mul_count += 1;
                }
                Instruction::Jnz(x, y) => {
                    if self.resolve(x) != 0 {
                        self.ptr += self.resolve(y) as usize - 1;
                    }
                },
                Instruction::Jpr(x, y) => {
                    if is_prime(self.resolve(x)) {
                        self.ptr += self.resolve(y) as usize - 1;
                    }
                }
            };

            self.ptr += 1;
        }
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
                "set" => Instruction::Set(to_register(parts[1]), to_value(parts[2])),
                "sub" => Instruction::Sub(to_register(parts[1]), to_value(parts[2])),
                "mul" => Instruction::Mul(to_register(parts[1]), to_value(parts[2])),
                "jnz" => Instruction::Jnz(to_value(parts[1]), to_value(parts[2])),
                "jpr" => Instruction::Jpr(to_value(parts[1]), to_value(parts[2])),
                _ => panic!(),
            }
        })
        .collect()
}

fn part1(program: Program) -> u32 {
    let mut runtime = Runtime::new(program, Registers::new());
    runtime.execute();
    runtime.mul_count
}

fn part2(program: Program) -> i64 {
    let mut optimised_program = program.clone();
    optimised_program[8] = Instruction::Jnz(Value::Number(1), Value::Number(16));
    optimised_program[24] = Instruction::Jpr(Value::FromRegister('b'), Value::Number(2));

    let mut registers = Registers::new();
    registers.insert('a', 1);

    let mut runtime = Runtime::new(optimised_program, registers);
    runtime.execute();

    *runtime.registers.get(&'h').expect("Register H")
}

fn is_prime(n: i64) -> bool {
    n > 1 && (2..=(n as f64).sqrt() as i64).all(|d| n % d > 0)
}
