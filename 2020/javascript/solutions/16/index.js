const { readGroupedLines } = require('../../utils/file-io');

let [rules, [, myTicket], [, ...nearbyTickets]] = readGroupedLines('input.txt');

rules = rules.map(rule => {
  let [, field, min1, max1, min2, max2] = rule.match(/([^:]+):\s(\d+)-(\d+)\sor\s(\d+)-(\d+)/);

  return [field, [[min1, max1], [min2, max2]]];
});

myTicket = myTicket.split(',').map(Number);
nearbyTickets = nearbyTickets.map(ticket => ticket.split(',').map(Number));

const isValueInRange = (value, ranges) => ranges.some(([min, max]) => value >= min && value <= max);

const getTicketError = (rules, ticket) => {
  for (const value of ticket) {
    if (!rules.some(([, ranges]) => isValueInRange(value, ranges))) {
      return value;
    }
  }

  return null;
};

const part1 = (rules, nearbyTickets) => nearbyTickets.reduce(
  (errorRate, ticket) => errorRate + getTicketError(rules, ticket) || 0,
  0
);

const part2 = (rules, nearbyTickets, myTicket) => {
  const validTickets = nearbyTickets.filter(ticket => null === getTicketError(rules, ticket));
  const possiblePlacements = Array.from({ length: myTicket.length }, () => []);

  for (let i = 0; i < myTicket.length; ++i) {
    for (const [field, ranges] of rules) {
      if (validTickets.every(ticket => isValueInRange(ticket[i], ranges))) {
        possiblePlacements[i].push(field);
      }
    }
  }

  const placedFields = [];
  let product = 1;

  while (placedFields.length < myTicket.length) {
    for (const [index, fields] of Object.entries(possiblePlacements)) {
      const unplaced = fields.filter(field => !placedFields.includes(field));

      if (unplaced.length !== 1) {
        continue;
      }

      placedFields.push(unplaced[0]);

      if (unplaced[0].startsWith('departure')) {
        product *= myTicket[index];
      }
    }
  }

  return product;
};

console.log(part1(rules, nearbyTickets), part2(rules, nearbyTickets, myTicket));
