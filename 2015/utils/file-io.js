const fs = require('fs');

const readRaw = path => fs.readFileSync(path, 'utf8');
const readLines = path => readRaw(path).split(/\n/);

const readGroupsRaw = path => readRaw(path).split(/\n{2,}/);
const readGroupedLines = path => readGroupsRaw(path).map(group => group.split(/\n/));

module.exports = { readRaw, readLines, readGroupsRaw, readGroupedLines };
