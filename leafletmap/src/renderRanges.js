import L from 'leaflet';
import ranges from './data/ranges.json';
import { TRAM_RANGE, BUS_RANGE, OTHER_RANGE } from './consts';

function renderRange(mapInstance, polygon, color) {
  L.geoJson(polygon, {
    color,
    fillColor: color,
    fillOpacity: 0.3,
    stroke: 1,
    opacity: 0.3
  }).addTo(mapInstance);
}

export default function renderRanges(mapInstance) {
  renderRange(mapInstance, ranges.otherBuses[200], OTHER_RANGE);
  renderRange(mapInstance, ranges.mpkBuses[300], BUS_RANGE);
  renderRange(mapInstance, ranges.trams[400], TRAM_RANGE);
}
