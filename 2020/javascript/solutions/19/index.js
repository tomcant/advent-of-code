const { readGroupedLines } = require('../../utils/file-io');

const [rulesRaw, messages] = readGroupedLines('input.txt');

const rules = Object.fromEntries(rulesRaw.map(rule => {
  const [, index, pattern] = rule.match(/(\d+):\s(.+)/);
  const [, char] = pattern.match(/"(\w)"/) || [];

  return [index, char || pattern.split(' | ').map(p => p.split(' '))];
}));

const match = (rules, message, [ruleIndex, ...rest]) =>
  undefined === ruleIndex
    ? 0 === message.length
    : 'string' === typeof rules[ruleIndex]
      ? message[0] === rules[ruleIndex] && match(rules, message.substr(1), rest)
      : rules[ruleIndex].some(group => match(rules, message, [...group, ...rest]));

const countMatches = (rules, messages) => messages.reduce((sum, message) => sum + match(rules, message, [0]), 0);

const part1 = (rules, messages) => countMatches(rules, messages);

const part2 = (rules, messages) => {
  rules[8] = [[42], [42, 8]];
  rules[11] = [[42, 31], [42, 11, 31]];

  return countMatches(rules, messages);
};

console.log(part1(rules, messages), part2(rules, messages));
