const fs = require('fs');
const { join } = require('path');

const versions = [
  require('../../webapp/src/data/lidlShops.json'),
  require('../../webapp/src/data/lidlShops.old.json')
];

versions.forEach((version, index) => {
  const organizedVersion = version.sort((a, b) => a.id.localeCompare(b.id));

  fs.writeFileSync(join(__dirname, `./version${index}.json`), JSON.stringify(organizedVersion, null, '  '), 'utf8');
});
