const { readLines } = require('../utils/file-io');

const rules = Object.fromEntries(
  readLines('input.txt').map(line => {
    const [, colour, bags] = line.match(/^(\w+\s\w+)\sbags contain\s(.+)\.$/);

    const rules = {};

    if ('no other bags' !== bags) {
      bags.split(', ').forEach(bag => {
        const [, count, colour] = bag.match(/(\d+)\s(\w+\s\w+)\sbags?/);
        rules[colour] = +count;
      });
    }

    return [colour, rules];
  })
);

const treeContainsColour = (rules, colours, searchColour) => Object.keys(colours).reduce(
  (found, colour) => found || colour === searchColour || treeContainsColour(rules, rules[colour], searchColour),
  false
);

const countRootNodesWithColourInSubtree = (rules, searchColour) => Object.keys(rules).reduce(
  (count, colour) => count + treeContainsColour(rules, rules[colour], searchColour),
  0
);

const sumNodesInSubtree = (rules, searchColour) => Object.keys(rules[searchColour]).reduce(
  (count, colour) => count + rules[searchColour][colour] * (1 + sumNodesInSubtree(rules, colour)),
  0
);

const part1 = rules => countRootNodesWithColourInSubtree(rules, 'shiny gold');
const part2 = rules => sumNodesInSubtree(rules, 'shiny gold');

console.log(part1(rules), part2(rules));
