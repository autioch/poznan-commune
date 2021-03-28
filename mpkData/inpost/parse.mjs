/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./inpost/db/points.json');

const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370
const POZNAN_CENTER_LAT = degToRad(52.409538);
const POZNAN_CENTER_LNG = degToRad(16.931992);

const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);

function haversineDistanceFromPoznanCenter(lat1, lon1) {
  lat1 = degToRad(lat1);

  const halfLapsAroundGlobe = sqrSinHalf(POZNAN_CENTER_LAT - lat1) + (sqrSinHalf(POZNAN_CENTER_LNG - degToRad(lon1)) * Math.cos(lat1) * Math.cos(POZNAN_CENTER_LAT));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c;
}

// b - lokal
// c - miejscowosc
// d - punkt
// e - ulica
// g - miejscowosc
// h - godziny otwarcia
// l - a = lat, o = lng
// n - id
const itemList = data.items
  .filter(({ l: { a: lat, o: lng } }) => haversineDistanceFromPoznanCenter(lat, lng) < 25)
  .map(({ b, c, d, e, h, l, n }) => ({
    id: n,
    longitude: l.o,
    latitude: l.a,
    locality: (c || '').trim(),
    address: [e, b, d].map((t = '') => t.trim()).join(' ').trim(),
    openingTimes: [h]
  }));

console.log(`Found ${itemList.length} inposts.`);

saveOutput('inposts', itemList, true);
