const { readGroupedLines } = require( '../../utils/file-io');

const part1 = (replacements, molecule) => {
  const molecules = new Set();

  for (const [from, to] of replacements) {
    let index = -Infinity;

    while (-1 !== (index = molecule.indexOf(from, index + from.length))) {
      molecules.add(molecule.substr(0, index) + to + molecule.substr(index + from.length));
    }
  }

  return molecules.size;
};

const part2 = (replacements, molecule) => {
  replacements = replacements.sort(([, a], [, b]) => b.length - a.length);

  let steps = 0;

  while ('e' !== molecule) {
    for (const [to, from] of replacements) {
      const next = molecule.replace(from, to);

      if (next !== molecule) {
        molecule = next;
        steps += 1;
      }
    }
  }

  return steps;
};

const [replacementsRaw, [molecule]] = readGroupedLines('input.txt');
const replacements = replacementsRaw.map(replacement => replacement.split(' => '));

console.log(part1(replacements, molecule), part2(replacements, molecule));
