enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R'
}

type Instruction = Direction[];
type Keypad = string[];

const getDoorCode = (instructions: Instruction[], keypad: Keypad): string => {
  const pad = ' '.repeat(keypad[0].length + 2);
  const paddedKeys = [pad, ...keypad.map(s => ` ${s} `), pad];
  const flatKeys = paddedKeys.join('');

  let keyIndex = flatKeys.indexOf('5');
  let code = '';

  for (const instruction of instructions) {
    for (const dir of instruction) {
      let diff;

      switch (dir) {
        case Direction.Up:
          diff = -paddedKeys[0].length;
          break;
        case Direction.Down:
          diff = paddedKeys[0].length;
          break;
        case Direction.Left:
          diff = -1;
          break;
        case Direction.Right:
          diff = 1;
          break;
      }

      if (' ' !== flatKeys[keyIndex + diff]) {
        keyIndex += diff;
      }
    }

    code += flatKeys[keyIndex];
  }

  return code;
};

export const part1 = (instructions: Instruction[]): string =>
  getDoorCode(
    instructions,
    [
      '123',
      '456',
      '789'
    ]
  );

export const part2 = (instructions: Instruction[]): string =>
  getDoorCode(
    instructions,
    [
      '  1  ',
      ' 234 ',
      '56789',
      ' ABC ',
      '  D  '
    ]
  );

export const parseInput = (input: string): Instruction[] =>
  input.split('\n').map(instructions => instructions.split('') as Instruction);
