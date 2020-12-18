const { readLines } = require('../../utils/file-io');

const LEFT = -1;
const RIGHT = 1;

const findExpressionLeftBound = (opIndex, expr) => findExpressionBound(opIndex, expr, LEFT, 0);
const findExpressionRightBound = (opIndex, expr) => findExpressionBound(opIndex, expr, RIGHT, expr.length);

const findExpressionBound = (opIndex, expr, direction, bound) => {
  const [depthIncreaseBracket, depthDecreaseBracket] =
    { [LEFT]: [')', '('], [RIGHT]: ['(', ')'] }[direction];

  let bracketCount = 0;

  for (let i = opIndex + direction; i !== bound; i += direction) {
    switch (expr[i]) {
      case depthIncreaseBracket:
        bracketCount += 1;
        break;

      case depthDecreaseBracket:
        if (bracketCount > 0) {
          bracketCount -= 1;
        }

        if (0 === bracketCount) {
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

  return bound;
};

let sum = 0;

readLines('input.txt').forEach(expr => {
  let plusCount = [...expr].filter(char => '+' === char).length;

  for (let i = 0; i < plusCount; ++i) {
    let plusToReplace = 0;

    for (let j = 0; j < expr.length; ++j) {
      plusToReplace += '+' === expr[j];

      if (plusToReplace > i) {
        const startPos = findExpressionLeftBound(j, expr);
        const endPos = findExpressionRightBound(j, expr);

        expr = `${expr.substr(0, startPos)}(${expr.substr(startPos, endPos - startPos + 1)})${expr.substr(endPos + 1)}`;
        break;
      }
    }
  }

  sum += eval(expr);
});

console.log(sum);
