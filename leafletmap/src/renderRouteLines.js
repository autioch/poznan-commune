import L from 'leaflet';
import routeLines from './data/routeLines.json';

function renderList(mapInstance, filter, options) {
  routeLines.filter(filter)
    .forEach(({ points, routeIds }) => L.polyline(points, options).addTo(mapInstance).bindPopup(routeIds.join(', ')));
}

export default function renderRoutes(mapInstance) {
  renderList(mapInstance, ({ isForOtherBus }) => isForOtherBus, {
    color: '#000',
    weight: 1,
    dashArray: [3, 3]
  });
  renderList(mapInstance, ({ isForTram }) => isForTram, {
    color: '#f0f',
    weight: 3,
    dashArray: [3, 3]
  });
  renderList(mapInstance, ({ isForMpkBus }) => isForMpkBus, {
    color: '#9c0',
    weight: 1,
    dashArray: [3, 3]
  });
}
