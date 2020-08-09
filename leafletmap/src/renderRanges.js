import L from 'leaflet';
import ranges from './data/ranges.json';
import { TRAM_RANGE, BUS_RANGE, OTHER_RANGE } from './consts';

function renderRange(mapInstance, polygon, color) {
  return L.geoJson(polygon, {
    color,
    fillColor: color,
    fillOpacity: 0.2,
    stroke: false

    // opacity: 0.2
  }).addTo(mapInstance);
}

export default function renderRanges(mapInstance) {
  L.control.layers({}, {
    'Other buses': renderRange(mapInstance, ranges.otherBuses[200], OTHER_RANGE),
    'MPK buses': renderRange(mapInstance, ranges.mpkBuses[300], BUS_RANGE),
    Tram: renderRange(mapInstance, ranges.trams[400], TRAM_RANGE)
  }).addTo(mapInstance);
}
