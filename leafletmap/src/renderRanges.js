import L from 'leaflet';
import ranges from './data/ranges.json';

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
  // renderRange(mapInstance, ranges.otherBuses, '#333');
  renderRange(mapInstance, ranges.mpkBuses, '#06f');
  renderRange(mapInstance, ranges.trams, '#0f0');
}
