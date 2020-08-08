import fs from 'fs';
import csvParser from 'csv-parser';
import { basename } from 'path';
import joinFromCurrentDir from './joinFromCurrentDir.mjs';

const join = joinFromCurrentDir(import.meta);

function getTable(tableName) {
  return new Promise((res) => {
    const results = [];

    fs.createReadStream(join('..', 'raw', tableName))
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => res(results));
  });
}

function saveTable(tableName, tableContent) {
  return fs.promises.writeFile(join('..', 'db', `${basename(tableName, '.txt')}.json`), JSON.stringify(tableContent, null, '  '));
}

(async () => {
  const tableNames = await fs.promises.readdir(join('..', 'raw'));
  const tablePromises = tableNames.map((tableName) => getTable(tableName).then((tableContent) => saveTable(tableName, tableContent)));

  await Promise.all(tablePromises);

  console.log('Done');
})();
