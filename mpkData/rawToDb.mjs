import fs from 'fs';
import csvParser from 'csv-parser';
import { join, basename } from 'path';
import dirName from './dirName.mjs';

const __dirname = dirName(import.meta);

async function getTable(tableName) {
  return new Promise((res) => {
    const results = [];

    fs.createReadStream(join(__dirname, 'raw', tableName))
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => res(results));
  })
}

(async () => {
  const tableNames = await fs.promises.readdir(join(__dirname, 'raw'));

  for (let i = 0; i < tableNames.length;i++) {
    const tableName = tableNames[i];
    const table = await getTable(tableName);
    await fs.promises.writeFile(join(__dirname, 'db', `${basename(tableName, '.txt')}.json`), JSON.stringify(table, null, '  '));
  }
})()
