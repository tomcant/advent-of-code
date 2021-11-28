const { readLines } = require('../utils/file-io');

const part1 = rules => findHappiestArrangementScore(rules);

const part2 = rules => {
  rules['Me'] = {};

  for (const person in rules) {
    rules['Me'][person] = rules[person]['Me'] = 0;
  }

  return findHappiestArrangementScore(rules);
};

const findHappiestArrangementScore = (rules, person = null, arrangement = []) => {
  if (person) {
    arrangement.push(person);
  }

  const toBeArranged = Object.keys(rules).filter(person => !arrangement.includes(person));

  if (toBeArranged.length === 0) {
    return scoreArrangement(arrangement, rules);
  }

  let bestScore = -Infinity;

  for (const nextPerson of toBeArranged) {
    const score = findHappiestArrangementScore(rules, nextPerson, arrangement.slice());

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
};

const scoreArrangement = (arrangement, rules) => {
  // Simulate the arrangement being circular.
  arrangement.push(arrangement[0]);

  let score = 0;

  for (let i = 0; i < arrangement.length - 1; ++i) {
    score += rules[arrangement[i]][arrangement[i + 1]] + rules[arrangement[i + 1]][arrangement[i]];
  }

  return score;
};

const rules = {};

for (const line of readLines('input.txt')) {
  const [, person, gainOrLose, happinessUnits, satNextTo] = line.match(/(.+) .+ (gain|lose) (\d+) .+ (.+)\./);

  rules[person] = rules[person] || {};
  rules[person][satNextTo] = 'gain' === gainOrLose ? +happinessUnits : -happinessUnits;
}

console.log('Part 1:', part1(rules));
console.log('Part 2:', part2(rules));
