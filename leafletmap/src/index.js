import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

import stops from './data/stops.json';
import agencies from './data/agencies.json';
import setupMap from './setupMap';
import renderRoutes from './routes';

// import stopsPolygon from './stopsPolygon';

const mapInstance = setupMap();

renderRoutes(mapInstance);

const isMpk = (id) => id == '2';

function getColor({ agencyIds }) {
  if (agencyIds.every(isMpk)) {
    return '#090';
  }
  if (agencyIds.some(isMpk)) {
    return '#fb0';
  }

  return '#f00';
}

function getFill({ isForBus, isForTram }) {
  if (isForTram && !isForBus) {
    return '#090';
  }
  if (isForTram && isForBus) {
    return '#fb0';
  }

  return '#f00';
}

function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
  return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
}

stops.forEach((stop) => { // eslint-disable-line no-shadow
  const { latitude, longitude, zoneId } = stop;

  L.circle([latitude, longitude], {
    radius: 50,

    color: getColor(stop),
    fillColor: getFill(stop),
    fillOpacity: 0.5,
    dashArray: zoneId === 'A' ? null : [4, 4]
  }).addTo(mapInstance).bindPopup(getStopPopup(stop));
});

// stopsPolygon(stops, '#093').addTo(mapInstance);
