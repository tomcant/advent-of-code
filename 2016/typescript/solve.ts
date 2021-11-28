import { readFileSync } from 'fs';

const [day, part, inputFile] = process.argv[2].split('/');
const dir = `${__dirname}/solutions/${day.padStart(2, '0')}`;
const input = readFileSync(`${dir}/${inputFile ?? 'input'}.txt`, 'utf-8');
const { part1, part2, parseInput } = require(dir);

(part === '1' || !part) && console.log('Part 1:', part1(parseInput(input)));
(part === '2' || !part) && console.log('Part 2:', part2(parseInput(input)));
