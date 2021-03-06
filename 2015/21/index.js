const { readLines } = require('../utils/file-io');

const part1 = boss => {
  let minCost = Infinity;

  for (const { scenario, winner } of playScenarios(boss)) {
    if ('player' === winner && scenario.cost < minCost) {
      minCost = scenario.cost;
    }
  }

  return minCost;
};

const part2 = boss => {
  let maxCost = -Infinity;

  for (const { scenario, winner } of playScenarios(boss)) {
    if ('boss' === winner && scenario.cost > maxCost) {
      maxCost = scenario.cost;
    }
  }

  return maxCost;
};

const shop = {
  weapons: [
    { type: 'w', name: 'Dagger', cost: 8, damage: 4, armor: 0 },
    { type: 'w', name: 'Shortsword', cost: 10, damage: 5, armor: 0 },
    { type: 'w', name: 'Warhammer', cost: 25, damage: 6, armor: 0 },
    { type: 'w', name: 'Longsword', cost: 40, damage: 7, armor: 0 },
    { type: 'w', name: 'Greataxe', cost: 74, damage: 8, armor: 0 }
  ],
  armor: [
    { type: 'a', name: 'None', cost: 0, damage: 0, armor: 0 },
    { type: 'a', name: 'Leather', cost: 13, damage: 0, armor: 1 },
    { type: 'a', name: 'Chainmail', cost: 31, damage: 0, armor: 2 },
    { type: 'a', name: 'Splintmail', cost: 53, damage: 0, armor: 3 },
    { type: 'a', name: 'Bandedmail', cost: 75, damage: 0, armor: 4 },
    { type: 'a', name: 'Platemail', cost: 102, damage: 0, armor: 5 }
  ],
  rings: [
    { type: 'r', name: 'None', cost: 0, damage: 0, armor: 0 },
    { type: 'r', name: 'Damage +1', cost: 25, damage: 1, armor: 0 },
    { type: 'r', name: 'Damage +2', cost: 50, damage: 2, armor: 0 },
    { type: 'r', name: 'Damage +3', cost: 100, damage: 3, armor: 0 },
    { type: 'r', name: 'Defense +1', cost: 20, damage: 0, armor: 1 },
    { type: 'r', name: 'Defense +2', cost: 40, damage: 0, armor: 2 },
    { type: 'r', name: 'Defense +3', cost: 80, damage: 0, armor: 3 }
  ],
};

const playScenarios = function* (boss) {
  const possibilities = cartesianProduct(shop.weapons, shop.armor, shop.rings, shop.rings)
    .filter(items => {
      const [ring1, ring2] = items.filter(({ type }) => 'r' === type);
      return ring1.name !== ring2.name;
    });

  for (const items of possibilities) {
    const scenario = {
      boss: { ...boss },
      player: {
        health: 100,
        damage: sumField(items, 'damage'),
        armor: sumField(items, 'armor')
      },
      cost: sumField(items, 'cost')
    };

    yield { scenario, winner: playScenario(scenario) };
  }
}

const playScenario = ({ player, boss }) => {
  const playerTurns = Math.ceil(boss.health / Math.max(1, player.damage - boss.armor));
  const bossTurns = Math.ceil(player.health / Math.max(1, boss.damage - player.armor));

  return playerTurns <= bossTurns ? 'player' : 'boss';
};

const cartesianProduct = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
const sumField = (items, field) => items.reduce((sum, item) => sum + item[field], 0);

const values = readLines('input.txt').map(line => +line.match(/\d+/)[0]);
const boss = { health: values[0], damage: values[1], armor: values[2] };

console.log('Part 1:', part1(boss));
console.log('Part 2:', part2(boss));
