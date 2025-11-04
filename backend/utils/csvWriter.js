const fs = require('fs');
const { Parser } = require('json2csv');

function writeCSV(filePath, data) {
  const json2csv = new Parser();
  const csv = json2csv.parse(data);

  fs.writeFileSync(filePath, csv, 'utf8');
}

module.exports = writeCSV;
