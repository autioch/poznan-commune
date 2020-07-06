import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default function dirName(importMeta){
  return dirname(fileURLToPath(import.meta.url));
}
