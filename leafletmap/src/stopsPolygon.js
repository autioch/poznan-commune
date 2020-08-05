/* eslint-disable no-bitwise, camelcase */
import spherical from 'spherical';
import L from 'leaflet';
import union from '@turf/union';

// import { polygon } from '@turf/helpers';

const RADIUS = 400;
const ARCS = 8;
const ANGLES = new Array(ARCS + 1).fill(null).map((_, i) => (i / ARCS) * 360); // eslint-disable-line no-unused-vars

function v2(stops, color) {
  const polygonUnion = stops.map(({ stop_lon, stop_lat }) => {
    const center = [stop_lon, stop_lat];

    return { // hack for invariant helper from truf
      coordinates: [ANGLES.map((angle) => spherical.radial(center, angle, RADIUS))]
    };
  }).reduce(union);

  return L.geoJson(polygonUnion, {
    color,
    fillColor: color,
    fillOpacity: 0.3
  });
}

export default v2;
