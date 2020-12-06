const { readGroupedLines } = require('../../utils/file-io');

const groups = readGroupedLines('input.txt').map(lines => {
  const group = {
    count: lines.length,
    answers: {}
  };

  for (const line of lines) {
    for (const question of [...line]) {
      group.answers[question] = group.answers[question] + 1 || 1;
    }
  }

  return group;
});

const part1 = groups => groups.reduce(
  (count, group) => count + Object.keys(group.answers).length,
  0
);

const part2 = groups => groups.reduce(
  (count, group) => count + Object.values(group.answers)
    .filter(count => group.count === count).length,
  0
);

console.log(part1(groups), part2(groups));
