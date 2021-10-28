use std::collections::HashMap;
use std::str::FromStr;

#[derive(Clone, Eq, PartialEq, Hash)]
struct Image {
    pixels: Vec<String>,
}

impl Image {
    fn initial() -> Self {
        ".#./..#/###".parse().expect("Initial image")
    }

    fn empty(size: usize) -> Self {
        Self {
            pixels: vec!["".to_string(); size],
        }
    }

    fn size(&self) -> usize {
        self.pixels.len()
    }

    fn transformation(&self, rules: &Rules) -> Self {
        self.chunks(if self.size() % 2 == 0 { 2 } else { 3 })
            .iter()
            .map(|row| {
                row.iter()
                    .map(|chunk| rules.get(&chunk).expect("Transformed chunk"))
                    .cloned()
                    .collect()
            })
            .collect::<ChunkedImage>()
            .into()
    }

    fn chunks(&self, chunk_size: usize) -> ChunkedImage {
        self.pixels
            .chunks(chunk_size)
            .map(|row| {
                let mut chunked_row = vec![];
                let mut cur_chunk = 0;

                for _ in 0..(self.size() / chunk_size) {
                    chunked_row.push(Self::empty(chunk_size));
                }

                for i in 0..row[0].len() {
                    for j in 0..chunk_size {
                        chunked_row[cur_chunk].pixels[j].push(row[j].chars().nth(i).unwrap());
                    }
                    if (i + 1) % chunk_size == 0 {
                        cur_chunk += 1;
                    }
                }

                chunked_row
            })
            .collect()
    }

    fn variations(&self) -> Vec<Self> {
        let mut variations = vec![];

        let flips = vec![
            self.clone(),
            self.clone().vert_flip(),
        ];

        for flip in flips {
            let mut initial = flip.clone();

            for _ in 0..4 {
                let rotation = initial.clockwise_rotation();
                variations.push(rotation.clone());
                initial = rotation;
            }
        }

        variations
    }

    fn vert_flip(&self) -> Self {
        let mut pixels = self.pixels.clone();
        pixels.reverse();
        Image { pixels }
    }

    fn clockwise_rotation(&self) -> Self {
        let size = self.size();
        let mut rotation = Self::empty(size);

        for i in 0..size {
            for j in (0..size).rev() {
                rotation.pixels[i].push(self.pixels[j].chars().nth(i).unwrap());
            }
        }

        rotation
    }

    fn count_pixels_turned_on(&self) -> i32 {
        self.pixels.iter().fold(0, |cnt, row| {
            cnt + row
                .chars()
                .fold(0, |cnt, pixel| cnt + if pixel == '#' { 1 } else { 0 })
        })
    }
}

impl FromStr for Image {
    type Err = ();

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        Ok(Self {
            pixels: input.split('/').map(|part| part.to_string()).collect(),
        })
    }
}

impl From<ChunkedImage> for Image {
    fn from(chunks: ChunkedImage) -> Self {
        let chunk_size = chunks[0][0].size();
        let height = chunks.len() * chunk_size;
        let mut image = Self::empty(height);

        for i in 0..chunks.len() {
            for j in 0..chunks[i].len() {
                for k in 0..chunks[i][j].pixels.len() {
                    image.pixels[i * chunk_size + k] += &chunks[i][j].pixels[k];
                }
            }
        }

        image
    }
}

type ChunkedImage = Vec<Vec<Image>>;
type Rules = HashMap<Image, Image>;

fn main() {
    let input = include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Rules {
    let mut rules: Rules = input
        .lines()
        .map(|line| {
            let parts: Vec<_> = line.split(" => ").collect();
            (
                parts[0].parse().expect("Parsed input grid"),
                parts[1].parse().expect("Parsed output grid"),
            )
        })
        .collect();

    let mut variations = Rules::new();

    for (image, transformation) in &rules {
        for variation in image.variations() {
            variations.insert(variation, transformation.clone());
        }
    }

    rules.extend(variations);
    rules
}

fn part1(rules: Rules) -> i32 {
    let mut image = Image::initial();

    for _ in 0..5 {
        image = image.transformation(&rules);
    }

    image.count_pixels_turned_on()
}

fn part2(rules: Rules) -> i32 {
    let mut image = Image::initial();

    for _ in 0..18 {
        image = image.transformation(&rules);
    }

    image.count_pixels_turned_on()
}
