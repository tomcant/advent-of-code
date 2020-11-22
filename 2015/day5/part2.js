const isStringNice = string => /(..).*\1/.test(string) && /(.).\1/.test(string);
const niceStringCount = require('./input').reduce((count, string) => count + isStringNice(string), 0);

console.log(niceStringCount);
