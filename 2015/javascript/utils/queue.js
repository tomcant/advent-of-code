class Queue {
  constructor(items = []) {
    this.items = items;
  }

  enqueue(...items) {
    this.items.push(...items);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.size === 0;
  }

  get size() {
    return this.items.length;
  }
}

module.exports = { Queue };
