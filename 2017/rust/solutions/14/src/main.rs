use std::collections::VecDeque;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(input));
    println!("Part 2: {}", part2(input));
}

fn part1(key: &str) -> u32 {
    build_disk(key)
        .data
        .iter()
        .fold(0, |cnt, data| cnt + data.count_ones())
}

fn part2(key: &str) -> u32 {
    let mut groups = 0;
    let mut disk = build_disk(key);

    while let Some(pos) = disk.find_first_non_empty_pos() {
        let mut queue = VecDeque::new();
        queue.push_back(pos);

        while let Some(pos) = queue.pop_front() {
            if disk.is_pos_empty(pos) {
                continue;
            }

            disk.clear_pos(pos);

            for neighbour in pos.neighbours() {
                queue.push_back(neighbour);
            }
        }

        groups += 1;
    }

    groups
}

struct Disk {
    data: Vec<u128>,
}

impl Disk {
    fn is_pos_empty(&self, DiskPos(x, y): DiskPos) -> bool {
        self.data[y] >> x & 1 == 0
    }

    fn clear_pos(&mut self, DiskPos(x, y): DiskPos) {
        self.data[y] &= u128::MAX ^ 1 << x;
    }

    fn find_first_non_empty_pos(&self) -> Option<DiskPos> {
        for y in 0..128 {
            if let Some(x) = (0..128).find(|x| !self.is_pos_empty(DiskPos(*x, y))) {
                return Some(DiskPos(x, y));
            }
        }

        None
    }
}

#[derive(Copy, Clone)]
struct DiskPos(usize, usize);

impl DiskPos {
    fn neighbours(self) -> Vec<DiskPos> {
        let DiskPos(x, y) = self;
        let mut neighbours = vec![];

        if x > 0 {
            neighbours.push(DiskPos(x - 1, y));
        }
        if x < 127 {
            neighbours.push(DiskPos(x + 1, y));
        }
        if y > 0 {
            neighbours.push(DiskPos(x, y - 1));
        }
        if y < 127 {
            neighbours.push(DiskPos(x, y + 1));
        }

        neighbours
    }
}

fn build_disk(key: &str) -> Disk {
    Disk {
        data: (0..128)
            .map(|idx| generate_knot_hash(&format!("{}-{}", key, idx)))
            .collect(),
    }
}

fn generate_knot_hash(input: &str) -> u128 {
    let lengths = [input.bytes().collect(), vec![17, 31, 73, 47, 23]].concat();

    generate_dense_hash(lengths)
        .iter()
        .enumerate()
        .fold(0, |hash, (idx, val)| {
            hash | ((reverse_bits(*val) as u128) << 8 * idx)
        })
}

fn generate_dense_hash(lengths: Vec<u8>) -> Vec<u8> {
    generate_sparse_hash(lengths)
        .chunks(16)
        .map(|chunk| chunk.iter().fold(0, |acc, val| acc ^ val))
        .collect()
}

fn generate_sparse_hash(lengths: Vec<u8>) -> Vec<u8> {
    apply_twists(lengths, 64)
}

fn apply_twists(lengths: Vec<u8>, rounds: i32) -> Vec<u8> {
    let mut numbers: Vec<u8> = (0..=255).collect();
    let mut cur_pos = 0;
    let mut skip_size = 0;

    for _ in 0..rounds {
        for length in &lengths {
            if *length > 0 {
                let mut right = (cur_pos + *length as usize) % numbers.len();
                let mut rotate_by = 0;

                if right <= cur_pos {
                    rotate_by = right;
                    right = numbers.len();
                    cur_pos -= rotate_by;
                    numbers.rotate_left(rotate_by);
                }

                numbers[cur_pos..right].reverse();

                if rotate_by != 0 {
                    cur_pos += rotate_by;
                    numbers.rotate_right(rotate_by);
                }
            }

            cur_pos += *length as usize + skip_size;
            cur_pos %= numbers.len();
            skip_size += 1;
        }
    }

    numbers
}

fn reverse_bits(mut b: u8) -> u8 {
    b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
    b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
    b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
    b
}
