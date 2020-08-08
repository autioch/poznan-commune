import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export default function pathFromCurrentDir(importMeta) {
  const baseDir = dirname(fileURLToPath(importMeta.url));

  return join.bind(null, baseDir);
}
