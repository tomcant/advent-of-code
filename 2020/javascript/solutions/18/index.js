const { readLines } = require('../../utils/file-io');

const part1 = expressions => {
  const resolveBrackets = expr => {
    let resolved = expr;
    let nextBracket;

    while (nextBracket = findNextDeepestBracket(resolved)) {
      const subExpr = resolved.substr(nextBracket.start + 1, nextBracket.end - nextBracket.start - 1);
      resolved = resolved.substr(0, nextBracket.start) + evalExpr(subExpr) + resolved.substr(nextBracket.end + 1);
    }

    return resolved;
  };

  const findNextDeepestBracket = expr => {
    let brackets = [];
    let depth = 0;

    [...expr].forEach((char, index) => {
      switch (char) {
        case '(':
          brackets.push({ depth: depth++, start: index });
          break;
        case ')':
          brackets.reduceRight((last, b) => last || (b.end ? null : b), null).end = index;
          depth -= 1;
          break;
      }
    });

    return brackets.sort((a, b) => a.depth - b.depth).pop();
  };

  const evalExpr = expr => {
    if (/^\d+$/.test(expr)) {
      return +expr;
    }

    const [, lhs, op, rhs] = expr.match(/(.+)\s([+*])\s(\d+)/);

    return '+' === op ? +rhs + evalExpr(lhs) : +rhs * evalExpr(lhs);
  };

  return expressions.reduce((sum, expr) => sum + evalExpr(resolveBrackets(expr)), 0);
};

const part2 = expressions => {
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

    while (n--) {
      index = str.indexOf(char, index + 1);
    }

    return index;
  };

  return expressions.reduce(
    (sum, expr) => {
      const plusCount = expr.match(/\+/g)?.length || 0;

      for (let n = 1; n <= plusCount; ++n) {
        const nthPlusIndex = nthIndexOf(expr, n, '+');
        const startPos = findExpressionLeftBound(nthPlusIndex, expr);
        const endPos = findExpressionRightBound(nthPlusIndex, expr);
        const plusExpr = expr.substr(startPos, endPos - startPos + 1);

        expr = [expr.substr(0, startPos), `(${plusExpr})`, expr.substr(endPos + 1)].join('');
      }

      return sum + eval(expr);
    },
    0
  );
};

const expressions = readLines('input.txt');

console.log(part1(expressions), part2(expressions));
