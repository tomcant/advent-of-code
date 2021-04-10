fn main() {
    let input = std::include_str!("input.txt");
    println!("Part 1: {}", part1(parse_input(input)));
    println!("Part 2: {}", part2(parse_input(input)));
}

fn parse_input(input: &str) -> Vec<Vec<i32>> {
    let mut spreadsheet: Vec<Vec<i32>> = vec![];

    for line in input.lines() {
        let mut row: Vec<i32> = vec![];

        for number in line.split_whitespace() {
            row.push(number.parse().unwrap());
        }

        spreadsheet.push(row);
    }

    return spreadsheet;
}

fn part1(spreadsheet: Vec<Vec<i32>>) -> i32 {
    let mut checksum = 0;

    for row in spreadsheet {
        checksum += row.iter().max().unwrap() - row.iter().min().unwrap();
    }

    return checksum;
}

fn part2(spreadsheet: Vec<Vec<i32>>) -> i32 {
    let mut checksum = 0;

    for row in spreadsheet {
        'row: for number in &row {
            for other_number in row.iter().filter(|&n| n < &number) {
                if number % other_number == 0 {
                    checksum += number / other_number;
                    break 'row;
                }
            }
        }
    }

    return checksum;
}
