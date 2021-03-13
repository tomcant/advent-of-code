const { readLines } = require('../utils/file-io');

const spells = [
  { name: 'Magic Missile', cost: 53, damage: 4, armor: 0, health: 0, mana: 0, duration: 1 },
  { name: 'Drain', cost: 73, damage: 2, armor: 0, health: 2, mana: 0, duration: 1 },
  { name: 'Shield', cost: 113, damage: 0, armor: 7, health: 0, mana: 0, duration: 6 },
  { name: 'Poison', cost: 173, damage: 3, armor: 0, health: 0, mana: 0, duration: 6 },
  { name: 'Recharge', cost: 229, damage: 0, armor: 0, health: 0, mana: 101, duration: 5 }
];

const isEffect = spell => spell.duration > 1;
const isEffectActive = (spell, state) => state.effects[spell.name] > 0;
const isAffordable = (spell, state) => state.balance >= spell.cost;

const findCheapestWinForPlayer = (boss, applyPlayerTurnFn) => {
  const initialState = {
    spent: 0,
    balance: 500,
    playerTurn: true,
    effects: {},
    player: {
      health: 50,
      armor: 0
    },
    boss
  };

  let minSpent = Infinity;

  (function play(currentState) {
    const state = applyActiveEffects(currentState);

    if (state.player.health <= 0 || state.spent >= minSpent) {
      return;
    }

    if (state.boss.health <= 0) {
      minSpent = Math.min(state.spent, minSpent);
      return;
    }

    if (state.playerTurn) {
      for (const spell of spells) {
        if (isAffordable(spell, state) && !isEffectActive(spell, state)) {
          play(applyPlayerTurnFn(spell, state));
        }
      }
    } else {
      play(applyBossTurn(state));
    }
  })(initialState);

  return minSpent;
};

const applyActiveEffects = currentState => {
  const state = cloneState(currentState);

  for (const name of Object.keys(state.effects)) {
    if (state.effects[name]-- > 0) {
      const [spell] = spells.filter(spell => spell.name === name);
      applySpell(spell, state);
    }
  }

  return state;
};

const applyPlayerTurn = (spell, currentState) => {
  const state = cloneState(currentState);

  state.balance -= spell.cost;
  state.spent += spell.cost;
  state.playerTurn = false;

  if (isEffect(spell)) {
    state.effects[spell.name] = spell.duration;
  } else {
    applySpell(spell, state);
  }

  return state;
};

const applyBossTurn = currentState => {
  const state = cloneState(currentState);

  state.player.health -= Math.max(1, state.boss.damage - state.player.armor);
  state.playerTurn = true;

  return state;
};

const applySpell = (spell, state) => {
  state.balance += spell.mana;
  state.boss.health -= spell.damage;
  state.player.health += spell.health;
  state.player.armor = spell.armor;

  if (0 === state.effects[spell.name]) {
    state.player.armor = 0;
  }
};

const cloneState = state => ({
  spent: state.spent,
  balance: state.balance,
  playerTurn: state.playerTurn,
  effects: { ...state.effects },
  player: { ...state.player },
  boss: { ...state.boss }
});

const part1 = boss => findCheapestWinForPlayer(boss, applyPlayerTurn);

const part2 = boss => findCheapestWinForPlayer(boss, (spell, currentState) => {
  const state = applyPlayerTurn(spell, currentState);
  state.player.health -= 1;
  return state;
});

const values = readLines('input.txt').map(line => +line.match(/\d+/)[0]);
const boss = { health: values[0], damage: values[1] };

console.log(part1(boss), part2(boss));
