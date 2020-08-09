import { saveOutput, readOutput } from './utils.mjs';
import spherical from 'spherical';
import { MPK_AGENCY } from './consts.mjs';
import union from '@turf/union';
import turf from '@turf/turf';

const ARCS = 18;
const ANGLES = new Array(ARCS + 1).fill(null).map((_, i) => (i / ARCS) * 360); // eslint-disable-line no-unused-vars

function stopToCircle(radius) {
  return ({ latitude, longitude }) => {
    const center = [longitude, latitude];

    return { // hack for invariant helper from truf
      coordinates: [ANGLES.map((angle) => spherical.radial(center, angle, radius))]
    };
  };
}

const circle100 = stopToCircle(100);
const circle200 = stopToCircle(200);
const circle300 = stopToCircle(300);
const circle400 = stopToCircle(400);
const circle500 = stopToCircle(500);

const poly100 = (stopList) => turf.cleanCoords(stopList.map(circle100).reduce(union.default));
const poly200 = (stopList) => turf.cleanCoords(stopList.map(circle200).reduce(union.default));
const poly300 = (stopList) => turf.cleanCoords(stopList.map(circle300).reduce(union.default));
const poly400 = (stopList) => turf.cleanCoords(stopList.map(circle400).reduce(union.default));
const poly500 = (stopList) => turf.cleanCoords(stopList.map(circle500).reduce(union.default));

const modes = Object.entries({
  '100': poly100,
  '200': poly200,
  '300': poly300,
  '400': poly400,
  '500': poly500
});

export default async function getRanges() {
  const stops = readOutput('stops').filter(({ isNightOnly }) => !isNightOnly);

  const trams = stops.filter(({ isForTram }) => isForTram);
  const tramSet = new Set(trams);

  const mpkBuses = stops.filter((stopItem) => !tramSet.has(stopItem) && stopItem.agencyIds.some((agencyId) => agencyId === MPK_AGENCY));

  const usedStops = new Set([...tramSet, ...mpkBuses]);
  const otherBuses = stops.filter((stopItem) => !usedStops.has(stopItem));

  const sortedStops = {
    trams,
    mpkBuses,
    otherBuses
  };

  const ranges = Object.entries(sortedStops).reduce((obj, [key, stopList]) => {
    obj[key] = modes.reduce((obj2, [mode, fn]) => {
      console.log('Range', key, mode);
      obj2[mode] = fn(stopList);

      return obj2;
    }, {});

    return obj;
  }, {});

  await saveOutput('ranges', ranges);
}
