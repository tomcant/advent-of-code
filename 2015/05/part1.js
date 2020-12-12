const { readLines } = require('../../utils/file-io');

const isStringNice = string => /[aeiou].*[aeiou].*[aeiou]/.test(string) && /(.)\1/.test(string) && !/(ab|cd|pq|xy)/.test(string);
const niceStringCount = readLines('input.txt').reduce((count, string) => count + isStringNice(string), 0);

console.log(niceStringCount);