import { saveOutput, readOutput } from './utils.mjs';
import spherical from 'spherical';
import { MPK_AGENCY } from './consts.mjs';
import union from '@turf/union';

// import intersect from '@turf/intersect';
// import difference from '@turf/difference';
import turf from '@turf/turf';

const ARCS = 18;
const ANGLES = new Array(ARCS + 1).fill(null).map((_, i) => (i / ARCS) * 360); // eslint-disable-line no-unused-vars

function stopToCoordinates(radius) {
  return ({ latitude, longitude }) => {
    const center = [longitude, latitude];

    return { // hack for invariant helper from truf
      coordinates: [ANGLES.map((angle) => spherical.radial(center, angle, radius))]
    };
  };
}

function cleanUp(multiPolygon) {
  const cleaned = turf.cleanCoords(multiPolygon);

  // if (turf.kinks(cleaned).features.length) {
  //   const fixed = turf.unkinkPolygon(cleaned);
  //
  //   // console.log('fixed', fixed.features.map((i) => i.geometry));
  //
  //   return fixed;
  // }

  return cleaned;
}

(async () => {
  const stops = readOutput('stops');
  const tramStops = stops.filter(({ isForTram }) => isForTram);
  const mpkBusStops = stops.filter(({ isForTram, isForBus, agencyIds }) => isForBus && !isForTram && agencyIds.some((agencyId) => agencyId === MPK_AGENCY));

  // const usedStops = new Set([...tramStops, ...mpkBusStops]);

  // const otherBusStops = stops.filter((stopItem) => !usedStops.has(stopItem));

  const trams = cleanUp(tramStops.map(stopToCoordinates(500)).reduce(union.default));
  const mpkBuses = cleanUp(mpkBusStops.map(stopToCoordinates(500)).reduce(union.default));

  // TODO Use turf.mask!
  // const otherBuses = turf.cleanCoords(otherBusStops.map(stopToCoordinates(300)).reduce(union.default));

  // const mpkBusNotTram = difference(mpkBuses, turf.unkinkPolygon(intersect.default(trams, mpkBuses)));

  // const mpkBusNotTram = intersect.default(mpkBuses, trams);

  const ranges = {
    trams,
    mpkBuses

    // mpkBusNotTram,
    // otherBuses
  };

  await saveOutput('ranges', ranges);
})();
