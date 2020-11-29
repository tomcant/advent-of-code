const sumExcludingRedObjects = json => {
  if (json instanceof Array) {
    return json.reduce((sum, item) => sum + sumExcludingRedObjects(item), 0);
  }

  if (json instanceof Object) {
    const items = Object.entries(json).map(([, item]) => item);

    return items.includes('red') ? 0 : sumExcludingRedObjects(items);
  }

  return parseInt(json) || 0;
};

const json = JSON.parse(require('fs').readFileSync('input.txt', 'utf8'));

console.log(sumExcludingRedObjects(json));
