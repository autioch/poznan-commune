import csvParser from 'csv-parser';
import extract from 'extract-zip';
import fs from 'fs';
import https from 'https';
import { basename } from 'path';

import { joinFromCurrentDir } from './utils.mjs';

const join = joinFromCurrentDir(import.meta, '..', 'db');

// https://www.ztm.poznan.pl/en/dla-deweloperow/gtfsFiles
const url = 'https://www.ztm.poznan.pl/en/dla-deweloperow/getGTFSFile';
const zipLocation = join('ZTMPoznanGTFS.zip');

function getZip() {
  console.log('getZip');

  return new Promise((res) => {
    https.get(url, (resp) => {
      const filePath = fs.createWriteStream(zipLocation);

      resp.pipe(filePath);
      filePath.on('finish', () => {
        filePath.close();
        console.log('getZip done');
        res();
      });
    });
  });
}

async function extractZip() {
  console.log('extractZip');
  try {
    await extract(zipLocation, {
      dir: join()
    });
    console.log('extractZip done');
  } catch (err) {
    console.log('extractZip error');
    console.log(err.message);
  }
}

function csvToJson(tableName) {
  return new Promise((res) => {
    const tableContent = [];

    fs.createReadStream(join(tableName))
      .pipe(csvParser())
      .on('data', (data) => tableContent.push(data))
      .on('end', () => {
        fs.promises
          .writeFile(join(`${basename(tableName, '.txt')}.json`), JSON.stringify(tableContent, null, '  '))
          .then(res);
      });
  });
}

async function createJsonFiles() {
  console.log('read text files');
  const tableNames = await fs.promises.readdir(join());

  console.log('read text files done');

  const tablePromises = tableNames.filter((tableName) => !tableName.endsWith('.zip')).map(csvToJson);

  await Promise.all(tablePromises);
  console.log('save json files done');
}

(async () => {
  await getZip();
  await extractZip();
  await createJsonFiles();

  console.log('Done');
})();
