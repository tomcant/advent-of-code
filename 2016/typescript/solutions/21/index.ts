export const parseInput = (input: string): Operation[] =>
  input.split("\n").map(OperationFactory.createFromStr);

export const part1 = (ops: Operation[]): string =>
  ops.reduce((pw, op) => op.apply(pw), "abcdefgh".split("")).join("");

export const part2 = (ops: Operation[]): string =>
  ops
    .reverse()
    .reduce((pw, op) => op.revert(pw), "fbgdceah".split(""))
    .join("");

type Password = string[];

interface Operation {
  apply(pw: Password): Password;
  revert(pw: Password): Password;
}

class MovePosition implements Operation {
  public constructor(private readonly x: number, private readonly y: number) {}

  public apply(pw: Password): Password {
    // prettier-ignore
    return pw.flatMap((char, idx) =>
      this.y === idx
        ? this.x < this.y
          ? [char, pw[this.x]]
          : [pw[this.x], char]
        : this.x === idx
          ? []
          : [char]
    );
  }

  public revert(pw: Password): Password {
    return new MovePosition(this.y, this.x).apply(pw);
  }
}

class SwapPosition implements Operation {
  public constructor(private readonly x: number, private readonly y: number) {}

  public apply(pw: Password): Password {
    return pw.map((char, idx) =>
      this.x === idx ? pw[this.y] : this.y === idx ? pw[this.x] : char
    );
  }

  public revert(pw: Password): Password {
    return this.apply(pw);
  }
}

class SwapLetter implements Operation {
  public constructor(private readonly x: string, private readonly y: string) {}

  public apply(pw: Password): Password {
    return pw.map(
      (char) => ({ [this.x]: this.y, [this.y]: this.x }[char] || char)
    );
  }

  public revert(pw: Password): Password {
    return this.apply(pw);
  }
}

class ReverseRange implements Operation {
  public constructor(private readonly x: number, private readonly y: number) {}

  public apply(pw: Password): Password {
    return pw.map((char, idx) =>
      idx >= this.x && idx <= this.y ? pw[this.y + this.x - idx] : char
    );
  }

  public revert(pw: Password): Password {
    return this.apply(pw);
  }
}

class RotateBySteps implements Operation {
  public constructor(
    private readonly dir: "left" | "right",
    private readonly steps: number
  ) {}

  public apply(pw: Password): Password {
    const len = pw.length;
    const dirs = { left: -1, right: 1 };

    return pw.map(
      (char, idx) =>
        pw[(((idx - this.steps * dirs[this.dir]) % len) + len) % len]
    );
  }

  public revert(pw: Password): Password {
    return new RotateBySteps(this.dir, -this.steps).apply(pw);
  }
}

class RotateByLetterPos implements Operation {
  static REVERT_ROT_LEFT = { 0: 1, 1: 1, 2: 6, 3: 2, 4: 7, 5: 3, 6: 0, 7: 4 };

  public constructor(private readonly letter: string) {}

  public apply(pw: Password): Password {
    const index = pw.indexOf(this.letter);
    const steps = 1 + index + (index >= 4 ? 1 : 0);
    return new RotateBySteps("right", steps).apply(pw);
  }

  public revert(pw: Password): Password {
    const index = pw.indexOf(this.letter);
    const steps = RotateByLetterPos.REVERT_ROT_LEFT[index];
    return new RotateBySteps("left", steps).apply(pw);
  }
}

class OperationFactory {
  public static createFromStr(str: string): Operation {
    if (str.startsWith("move position")) {
      const [, x, y] = str.match(/(\d+) .+ (\d+)/);
      return new MovePosition(+x, +y);
    }

    if (str.startsWith("swap position")) {
      const [, x, y] = str.match(/(\d+) .+ (\d+)/);
      return new SwapPosition(+x, +y);
    }

    if (str.startsWith("swap letter")) {
      const [, x, y] = str.match(/(\w) with letter (\w)/);
      return new SwapLetter(x, y);
    }

    if (str.startsWith("reverse")) {
      const [, x, y] = str.match(/(\d+) .+ (\d+)/);
      return new ReverseRange(+x, +y);
    }

    if (str.startsWith("rotate based on position of letter")) {
      const [, letter] = str.match(/(\w)$/);
      return new RotateByLetterPos(letter);
    }

    if (str.startsWith("rotate")) {
      const [, dir, steps] = str.match(/rotate (left|right) (\d+) steps?/);
      return new RotateBySteps(dir as "left" | "right", +steps);
    }

    throw new Error(`Unhandled operation ${str}`);
  }
}
