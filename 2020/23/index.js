const { readRaw } = require('../utils/file-io');

class Cup {
  constructor(value) {
    this.value = value;
    this.next = this.prev = null;
  }
}

class CupList {
  constructor() {
    this.min = null;
    this.max = null;
    this.head = null;
    this.lookup = {};
  }

  get(value) {
    return this.lookup[value];
  }

  add(value) {
    const node = new Cup(value);
    this.lookup[value] = node;

    this.min = !this.min || value < this.min ? value : this.min;
    this.max = !this.max || value > this.max ? value : this.max;

    if (!this.head) {
      this.head = node.prev = node;
      return;
    }

    node.next = this.head;
    node.prev = this.head.prev;
    this.head.prev.next = node;
    this.head.prev = node;
  }

  move(value, after) {
    const from = this.lookup[value];
    const to = this.lookup[after];

    from.next.prev = from.prev;
    from.prev.next = from.next;

    from.next = to.next;
    from.prev = to;

    to.next.prev = from;
    to.next = from;
  }

  static fromArray(array) {
    const list = new CupList();

    for (const value of array) {
      list.add(value);
    }

    return list;
  }
}

const play = (cups, iterations) => {
  let current = cups.head;

  while (iterations--) {
    const pickup = [current.next.next.next.value, current.next.next.value, current.next.value];
    let destination = current.value - 1;

    while ([cups.min - 1, ...pickup].includes(destination)) {
      destination = destination > cups.min ? destination - 1 : cups.max;
    }

    pickup.forEach(cup => void cups.move(cup, destination));
    current = current.next;
  }

  return cups;
};

const part1 = cups => {
  const list = CupList.fromArray(cups);

  play(list, 100);

  const one = list.get(1);
  let node = one.next;
  let result = '';

  do result += node.value;
  while ((node = node.next).value !== 1);

  return result;
};

const part2 = cups => {
  const list = CupList.fromArray(cups);

  for (let cup = list.max + 1; cup <= 1_000_000; ++cup) {
    list.add(cup);
  }

  play(list, 10_000_000);

  const one = list.get(1);

  return one.next.value * one.next.next.value;
};

const cups = readRaw('input.txt').split('').map(Number);

console.log(part1(cups), part2(cups));
