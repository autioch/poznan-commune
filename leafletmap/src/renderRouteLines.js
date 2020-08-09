import L from 'leaflet';
import routeLines from './data/routeLines.json';
import { TRAM_LINE, BUS_LINE, OTHER_LINE } from './consts';

function renderList(mapInstance, filter, options) {
  routeLines.filter(filter)
    .forEach(({ points, routeIds }) => L.polyline(points, options).addTo(mapInstance).bindPopup(routeIds.join(', ')));
}

export default function renderRoutes(mapInstance) {
  renderList(mapInstance, ({ isForOtherBus }) => isForOtherBus, {
    color: OTHER_LINE,
    weight: 1,
    dashArray: [3, 3]
  });
  renderList(mapInstance, ({ isForMpkBus }) => isForMpkBus, {
    color: BUS_LINE,
    weight: 1,
    dashArray: [3, 3]
  });
  renderList(mapInstance, ({ isForTram }) => isForTram, {
    color: TRAM_LINE,
    weight: 2,
    dashArray: [3, 3]
  });
}
