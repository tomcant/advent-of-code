const { readRaw } = require('../utils/file-io');

const instructions = readRaw('input.txt');

console.log(instructions.match(/\(/g).length - instructions.match(/\)/g).length);
