/* eslint-disable no-underscore-dangle */
import { createRequire } from 'module';
import joinFromCurrentDir from './joinFromCurrentDir.mjs';

const join = joinFromCurrentDir(import.meta);
const require = createRequire(import.meta.url); // eslint-disable-line no-shadow
const cache = {};

export default function getDbTable(tableName) {
  return cache[tableName] || (cache[tableName] = require(join('..', 'db', `${tableName}.json`)));
}
