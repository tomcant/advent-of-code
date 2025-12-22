const { readLines } = require('../../utils/file-io');

const run = ops => {
  const visited = [];
  let [acc, next] = [0, 0];

  while (next < ops.length) {
    if (visited.includes(next)) {
      return { acc, terminated: false };
    }

    visited.push(next);

    let increment = 1;
    const [op, arg] = ops[next];

    switch (op) {
      case 'acc':
        acc += arg;
        break;
      case 'jmp':
        increment = arg;
        break;
    }

    next += increment;
  }

  return { acc, terminated: true };
};

const part1 = ops => run(ops).acc;

const part2 = ops => Object.entries(ops)
  .filter(([, [op]]) => ['nop', 'jmp'].includes(op))
  .reduce(
    (runResult, [index]) => runResult.terminated ? runResult :
      run(ops.map(([op, arg], i) => [index - i ? op : { nop: 'jmp', jmp: 'nop' }[op], arg])),
    { acc: null, terminated: false }
  ).acc;

const ops = readLines('input.txt').map(op => op.split(' ')).map(([op, arg]) => [op, +arg]);

console.log(part1(ops), part2(ops));
