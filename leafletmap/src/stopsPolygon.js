/* eslint-disable no-bitwise */
import spherical from 'spherical';
import L from 'leaflet';
const { io: { GeoJSONParser, GeoJSONReader } } = require('jsts');

// import wgs84 from 'wgs84';
// const RADIUS_ANGLE = RADIUS / wgs84.RADIUS * 180 / Math.PI;

const RADIUS = 400;
const ARCS = 4;
const ANGLES = new Array(ARCS + 1).fill(null).map((_, i) => (i / ARCS) * 360); // eslint-disable-line no-unused-vars

const reader = new GeoJSONReader();
const parser = new GeoJSONParser();

function circle(stopItem) {
  const center = [stopItem.stop_lon, stopItem.stop_lat];

  return reader.read({
    type: 'Polygon',
    coordinates: [ANGLES.map((angle) => spherical.radial(center, angle, RADIUS))]
  });
}

export default function stopsPolygon(stops, color) {
  const polygonUnion = stops.map(circle).reduce((a, b) => a.union(b));

  return L.geoJson({
    type: 'Feature',
    geometry: parser.write(polygonUnion)
  }, {
    color,
    fillColor: color,
    fillOpacity: 0.3
  });
}
