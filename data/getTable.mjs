import fs from 'fs';
import csvParser from 'csv-parser';

const cache = {};

async function buildTable(tableName) {
  return new Promise((res) => {
    const results = [];

    fs.createReadStream(`./data/${tableName}.txt`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => res(results));
  })
}


export default async function getTable(tableName) {
  return cache[tableName] || (cache[tableName] = buildTable(tableName));
}
