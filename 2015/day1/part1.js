const instructions = require('./input');

console.log(instructions.match(/\(/g).length - instructions.match(/\)/g).length);
