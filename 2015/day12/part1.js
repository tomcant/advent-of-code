console.log(require('fs').readFileSync('input.txt', 'utf8').match(/-?\d+/g).reduce((sum, n) => sum + n / 1, 0));
