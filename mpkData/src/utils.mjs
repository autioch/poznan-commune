/* eslint-disable no-underscore-dangle */
import { createRequire } from 'module';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { TRAM_TOURIST, BUS_TOURIST, NIGHT_ROUTE } from './consts.mjs';

function joinFromCurrentDir(importMeta) {
  const baseDir = dirname(fileURLToPath(importMeta.url));

  return join.bind(null, baseDir);
}

const dbJoin = joinFromCurrentDir(import.meta);
const outputJoin = joinFromCurrentDir(import.meta);
const require = createRequire(import.meta.url); // eslint-disable-line no-shadow
const dbCache = {};
const APP_DATA_FOLDER = ['..', '..', 'leafletmap', 'src', 'data'];

function getDbTable(tableName) {
  return dbCache[tableName] || (dbCache[tableName] = require(dbJoin('..', 'db', `${tableName}.json`)));
}

function saveOutput(fileName, fileContent, debug = false) {
  console.log(fileName, 'save');

  return fs.writeFile(outputJoin(...APP_DATA_FOLDER, `${fileName}.json`), JSON.stringify(fileContent, null, debug ? 2 : undefined)); // eslint-disable-line no-undefined
}

function readOutput(fileName) {
  return require(outputJoin(...APP_DATA_FOLDER, `${fileName}.json`));
}

const isDailyRoute = (routeId) => routeId !== TRAM_TOURIST && routeId !== BUS_TOURIST && !NIGHT_ROUTE.test(routeId);

export {
  isDailyRoute,
  getDbTable,
  saveOutput,
  readOutput,
  joinFromCurrentDir
};
