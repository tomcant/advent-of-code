const fs = require('fs');
const os = require('os');

const readRaw = path => fs.readFileSync(path, 'utf8');
const readLines = path => readRaw(path).split(os.EOL);

module.exports = { readRaw, readLines };
