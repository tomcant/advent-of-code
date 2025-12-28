const fs = require("fs");
const path = require("path");

function main(dayNo) {
  if (!dayNo) {
    throw new Error("Usage: node solve.js <dayNo>");
  }

  const dayDir = path.join(__dirname, "solutions", dayNo.padStart(2, "0"));
  const entryJs = path.join(dayDir, "index.js");

  if (!fs.existsSync(dayDir)) {
    throw new Error(`Day directory not found: ${dayDir}`);
  }
  if (!fs.existsSync(entryJs)) {
    throw new Error(`Entry file not found: ${entryJs}`);
  }

  process.chdir(dayDir);
  require(entryJs);
}

main(process.argv[2]);
