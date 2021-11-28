const { readLines } = require('../utils/file-io');

class Program {
  #instructions = [];
  #memory = new Map();
  #mask = null;

  constructor(instructions, runInstruction) {
    this.#instructions = instructions.map(([lhs, rhs]) => {
      if ('mask' === lhs) {
        return () => this.#mask = rhs.split('').reverse();
      }

      let [, address] = lhs.match(/\[(\d+)]/);

      return () => {
        const { value, addresses } = runInstruction(+rhs, this.#mask, address);
        addresses.forEach(address => void this.#memory.set(address, value));
      };
    });
  }

  run() {
    this.#instructions.forEach(runInstruction => void runInstruction());
  }

  get memory() {
    return this.#memory;
  }
}

const sumMemory = program => [...program.memory].reduce((sum, [, value]) => sum + value, 0);

const part1 = instructions => {
  const program = new Program(instructions, (value, mask, address) => {
    let newValue = 0;

    mask.forEach((bit, index) => {
      switch (bit) {
        case '1':
          newValue += 2 ** index;
          break;
        case 'X':
          newValue += 2 ** index & value;
          break;
      }
    });

    return {
      value: newValue,
      addresses: [address]
    };
  });

  program.run();

  return sumMemory(program);
}

const part2 = instructions => {
  const enumerateAddresses = (baseAddress, floating) => {
    if (0 === floating.length) {
      return [baseAddress];
    }

    const [head, ...tail] = floating;

    return [
      ...enumerateAddresses(baseAddress, tail),
      ...enumerateAddresses(baseAddress + 2 ** head, tail)
    ];
  };

  const program = new Program(instructions, (value, mask, address) => {
    let baseAddress = 0;
    const floating = [];

    mask.forEach((bit, index) => {
      switch (bit) {
        case '0':
          baseAddress += 2 ** index & address;
          break;
        case '1':
          baseAddress += 2 ** index;
          break;
        case 'X':
          floating.push(index);
          break;
      }
    });

    return {
      value,
      addresses: enumerateAddresses(baseAddress, floating)
    };
  });

  program.run();

  return sumMemory(program);
};

const instructions = readLines('input.txt').map(line => line.split(' = '));

console.log(part1(instructions), part2(instructions));
