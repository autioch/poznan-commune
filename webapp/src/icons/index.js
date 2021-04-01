/* eslint-disable max-len */
import './styles.scss';

import biedronka from './biedronka.png';
import bus from './bus.png';
import inpost from './inpost.png';
import lidl from './lidl.png';
import netto from './netto.png';
import otherBus from './otherBus.png';
import pharmacy from './pharmacy.png';
import smile from './smile.png';
import tram from './tram.png';
import zabka from './zabka.png';

export default {
  biedronka, // 32x48
  bus, // 16x16
  inpost, // 36x24
  lidl, // 32x32
  netto,
  otherBus, // 16x16
  pharmacy, // 24x24
  smile,
  tram, // 16x16
  zabka // 18x24
};

//
// const defsEl = document.createElement('div');
//
// const patterns = [
//   ['biedronka', biedronka, 32, 48],
//   ['bus', bus, 16, 16],
//   ['inpost', inpost, 36, 24],
//   ['lidl', lidl, 32, 32],
//   ['otherBus', otherBus, 16, 16],
//   ['pharmacy', pharmacy, 24, 24],
//   ['tram', tram, 16, 16],
//   ['zabka', zabka, 18, 24]
// ]
//   .map(([id, url, width, height]) => `
//     <pattern id="${id}" width="${width}" height="${height}">
//       <image href="${url}" x="0" y="0" width="${width}" height="${height}" />
//     </pattern>
//   `)
//   .join('');
//
// defsEl.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">
//   <defs>${patterns}</defs>
// </svg>
// <svg xmlns="http://www.w3.org/2000/svg" class="svg-test-svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 100 100">
// <circle cx="40" cy="60" r="40" fill="url(#biedronka)"/>
// </svg>
// `;
//
// defsEl.className = 'svg-test';
//
// document.body.append(defsEl);
