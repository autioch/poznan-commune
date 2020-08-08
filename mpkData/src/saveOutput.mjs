import fs from 'fs/promises';
import joinFromCurrentDir from './joinFromCurrentDir.mjs';

const join = joinFromCurrentDir(import.meta);

const APP_DATA_FOLDER = ['..', '..', 'leafletmap', 'src', 'data'];

export default function saveOutput(fileName, fileContent, debug = false) {
  return fs.writeFile(join(...APP_DATA_FOLDER, `${fileName}.json`), JSON.stringify(fileContent, null, debug ? 2 : undefined)); // eslint-disable-line no-undefined
}
