import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import stops from './data/stops.json';
import agencies from './data/agencies.json';

// const isMpk = (id) => id === '2';
//
// function getColor({ agencyIds }) {
//   if (agencyIds.every(isMpk)) {
//     return '#090';
//   }
//   if (agencyIds.some(isMpk)) {
//     return '#fb0';
//   }
//
//   return '#f00';
// }
//
// function getFill({ isForBus, isForTram }) {
//   if (isForTram && !isForBus) {
//     return '#090';
//   }
//   if (isForTram && isForBus) {
//     return '#fb0';
//   }
//
//   return '#f00';
// }

function a(zoom) {
  const radius = maxClusterRadius(zoom);

  console.log('#', zoom, radius, typeof zoom, typeof radius);

  return 0;
}

function maxClusterRadius(zoom) {
  switch (zoom) {
    case 9: return 10;
    case 10: return 30;
    case 11: return 35;
    case 12: return 35;
    case 13: return 25;
    case 14: return 20;
    case 15: return 15;
    case 16: return 15;
    case 17: return 15;
    case 18: return 10;
    default: return 90;
  }
}

function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
  return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
}

export default function renderStopCircles(mapInstance) {
  const stopGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: a
  });

  stops.forEach((stop) => { // eslint-disable-line no-shadow
    const { latitude, longitude } = stop;

    stopGroup.addLayer(L.marker([latitude, longitude]).bindPopup(getStopPopup(stop)));
  });

  mapInstance.on('zoom', () => console.log(mapInstance.getZoom())); // eslint-disable-line no-console
  mapInstance.addLayer(stopGroup);
}
