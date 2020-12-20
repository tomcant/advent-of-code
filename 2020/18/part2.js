const { readLines } = require('../../utils/file-io');

const LEFT = -1, RIGHT = 1;

const findExpressionLeftBound = (opIndex, expr) => findExpressionBound(opIndex, expr, LEFT, 0);
const findExpressionRightBound = (opIndex, expr) => findExpressionBound(opIndex, expr, RIGHT, expr.length);

const findExpressionBound = (opIndex, expr, direction, limit) => {
  const [depthIncreaseBracket, depthDecreaseBracket] =
    { [LEFT]: [')', '('], [RIGHT]: ['(', ')'] }[direction];

  let bracketCount = 0;

  for (let i = opIndex + direction; i !== limit; i += direction) {
    switch (expr[i]) {
      case depthIncreaseBracket:
        bracketCount += 1;
        break;

      case depthDecreaseBracket:
        if (0 === bracketCount--) {
          return i;
        }

        break;

      case '+':
      case '*':
        if (0 === bracketCount) {
          return i - direction;
        }
    }
  }

  return limit;
};

const nthIndexOf = (str, n, char) => {
  let index = -1;

  do index = str.indexOf(char, index + 1);
  while (--n);

  return index;
};

let sum = 0;

readLines('input.txt').forEach(expr => {
  let plusCount = [...expr].filter(char => '+' === char).length;

  for (let n = 1; n <= plusCount; ++n) {
    const nthPlusIndex = nthIndexOf(expr, n, '+');
    const startPos = findExpressionLeftBound(nthPlusIndex, expr);
    const endPos = findExpressionRightBound(nthPlusIndex, expr);

    expr = `${expr.substr(0, startPos)}(${expr.substr(startPos, endPos - startPos + 1)})${expr.substr(endPos + 1)}`;
  }

  sum += eval(expr);
});

console.log(sum);
