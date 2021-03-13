const { readRaw } = require('../utils/file-io');

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

const json = JSON.parse(readRaw('input.txt'));

console.log(sumExcludingRedObjects(json));
