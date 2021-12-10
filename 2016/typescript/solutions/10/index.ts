import Queue from "../../utils/queue";

type BotRef = number;
type Bot = [number?, number?];
type Output = number;
type Factory = [Bot[], Output[]];

export const parseInput = (input: string): Instruction[] =>
  input
    .split("\n")
    .map((line) =>
      line.startsWith("bot")
        ? ResolveBot.fromString(line)
        : InitialiseBot.fromString(line)
    );

export const part1 = (instructions: Instruction[]): number => {
  for (const [bots] of resolve(instructions)) {
    for (const [idx, bot] of bots.entries()) {
      if (bot && bot.length === 2 && bot[0] === 17 && bot[1] === 61) {
        return idx;
      }
    }
  }
};

export const part2 = (instructions: Instruction[]): number => {
  for (const [, outputs] of resolve(instructions)) {
    const product = outputs[0] * outputs[1] * outputs[2];

    if (!isNaN(product)) {
      return product;
    }
  }
};

interface Instruction {
  apply(factory: Factory): boolean;
}

class InitialiseBot implements Instruction {
  private constructor(
    private readonly botRef: BotRef,
    private readonly value: number
  ) {}

  public static fromString(str: string): InitialiseBot {
    const [, value, botRef] = str.match(/value (\d+) goes to bot (\d+)/);
    return new this(+botRef, +value);
  }

  public apply([bots]: Factory): boolean {
    bots[this.botRef] = bots[this.botRef] || [];
    bots[this.botRef].push(this.value);
    return true;
  }
}

class ResolveBot implements Instruction {
  private constructor(
    private readonly botRef: BotRef,
    private readonly lowType: string,
    private readonly highType: string,
    private readonly lowDest: number,
    private readonly highDest: number
  ) {}

  public static fromString(str: string): ResolveBot {
    const [, botRef, lowType, lowDest, highType, highDest] = str.match(
      /(\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/
    );

    return new this(+botRef, lowType, highType, +lowDest, +highDest);
  }

  public apply(factory: Factory): boolean {
    const [bots] = factory;

    if (bots[this.botRef]?.length !== 2) {
      return false;
    }

    const [lowVal, highVal] = bots[this.botRef].sort((a, b) => a - b);

    this.resolve(factory, this.lowType, this.lowDest, lowVal);
    this.resolve(factory, this.highType, this.highDest, highVal);

    return true;
  }

  private resolve(
    [bots, outputs]: Factory,
    type: string,
    dest: number,
    value: number
  ): void {
    switch (type) {
      case "bot":
        bots[dest] = bots[dest] || [];
        bots[dest].push(value);
        break;
      case "output":
        outputs[dest] = value;
        break;
    }
  }
}

const resolve = function* (instructions: Instruction[]): Generator<Factory> {
  const queue = new Queue<Instruction>(instructions);
  const factory: Factory = [[], []];

  while (!queue.isEmpty()) {
    const instruction = queue.dequeue();

    if (!instruction.apply(factory)) {
      queue.enqueue(instruction);
      continue;
    }

    yield factory;
  }
};
