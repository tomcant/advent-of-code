enum PixelState {
  On = '#',
  Off = '.'
}

class Screen {
  private constructor(private pixels: PixelState[][]) {}

  public static fromPixels(pixels: PixelState[][]): Screen {
    return new this(pixels);
  }

  public static fromWidthAndHeight(width: number, height: number): Screen {
    const pixels: PixelState[][] = [];

    for (let i = 0; i < height; ++i) {
      pixels.push(Array(width).fill(PixelState.Off));
    }

    return new this(pixels);
  }

  public clone(): Screen {
    return Screen.fromPixels(this.pixels.map(line => [...line]));
  }

  public setPixel(x: number, y: number, state: PixelState): void {
    this.pixels[y][x] = state;
  }

  public getRow(idx: number): PixelState[] {
    return [...this.pixels[idx]];
  }

  public getCol(idx: number): PixelState[] {
    return this.pixels.map(line => line[idx]);
  }

  get width(): number {
    return this.pixels[0].length;
  }

  get height(): number {
    return this.pixels.length;
  }

  public countOnPixels(): number {
    return this.pixels.flat().reduce(
      (count, pixel) => count + +(PixelState.On === pixel),
      0
    );
  }

  public toString(): string {
    return this.pixels.map(line => line.join('')).join('\n');
  }
}

interface Instruction {
  apply(screen: Screen): Screen;
}

class DrawRectangle implements Instruction {
  constructor(readonly width: number, readonly height: number) {}

  public static fromString(str: string): DrawRectangle {
    const [, width, height] = str.match(/(\d+)x(\d+)/);
    return new this(+width, +height);
  }

  public apply(screen: Screen): Screen {
    const clone = screen.clone();

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        clone.setPixel(x, y, PixelState.On);
      }
    }

    return clone;
  }
}

class RotateAxis implements Instruction {
  constructor(
    readonly axis: 'x' | 'y',
    readonly xyVal: number,
    readonly times: number
  ) {}

  public static fromString(str: string): RotateAxis {
    const [, axis, xyVal, times] = str.match(/([xy])=(\d+)\sby\s(\d+)/);
    return new this(axis as 'x' | 'y', +xyVal, +times);
  }

  public apply(screen: Screen): Screen {
    return this['x' === this.axis ? 'rotateX' : 'rotateY'](screen.clone());
  }

  private rotateX(screen: Screen): Screen {
    const oldCol = screen.getCol(this.xyVal);

    for (let i = 0; i < screen.height; ++i) {
      screen.setPixel(this.xyVal, (i + this.times) % screen.height, oldCol[i]);
    }

    return screen;
  }

  private rotateY(screen: Screen): Screen {
    const oldRow = screen.getRow(this.xyVal);

    for (let i = 0; i < screen.width; ++i) {
      screen.setPixel((i + this.times) % screen.width, this.xyVal, oldRow[i]);
    }

    return screen;
  }
}

const applyInstructions = (instructions: Instruction[]): Screen =>
  instructions.reduce(
    (screen, instruction) => instruction.apply(screen),
    Screen.fromWidthAndHeight(50, 6)
  );

export const part1 = (instructions: Instruction[]): number => applyInstructions(instructions).countOnPixels();
export const part2 = (instructions: Instruction[]): string => '\n' + applyInstructions(instructions).toString();

export const parseInput = (input: string): Instruction[] =>
  input.split('\n').map(instruction => {
    return instruction.startsWith('rect')
      ? DrawRectangle.fromString(instruction)
      : RotateAxis.fromString(instruction);
  });
