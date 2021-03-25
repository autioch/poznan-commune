/* eslint-disable no-underscore-dangle */
import fs from 'fs/promises';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { BUS_TOURIST, NIGHT_ROUTE, TRAM_TOURIST } from './consts.mjs';

function joinFromCurrentDir(importMeta, ...subfolders) {
  const baseDir = dirname(fileURLToPath(importMeta.url));

  return join.bind(null, baseDir, ...subfolders);
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
