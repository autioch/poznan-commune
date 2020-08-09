import L from 'leaflet';
import stops from './data/stops.json';
import agencies from './data/agencies.json';
import { TRAM_STOP, BUS_STOP } from './consts';

function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
  return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
}

export default function renderStopCircles(mapInstance) {
  stops.forEach((stop) => { // eslint-disable-line no-shadow
    const { latitude, longitude, isForTram } = stop;
    const color = isForTram ? TRAM_STOP : BUS_STOP;

    L.circle([latitude, longitude], {
      radius: 5,

      // border
      color,
      weight: 5,
      opacity: 1,

      // background
      fillColor: color,
      fillOpacity: 0.5
    }).addTo(mapInstance).bindPopup(getStopPopup(stop));
  });
}
