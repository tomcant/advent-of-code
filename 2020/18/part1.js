const { readLines } = require('../../utils/file-io');

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

console.log(readLines('input.txt').reduce((sum, expr) => sum + evalExpr(resolveBrackets(expr)), 0));
