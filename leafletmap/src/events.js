import L from 'leaflet';
import stops from './data/stops.json';
import { haversine1 } from './haversine';
import { TRAM_LINE, BUS_LINE } from './consts';
import markerIconPng from './smile.png';

const tramStops = stops.filter(({ isForTram }) => isForTram);
const busStops = stops.filter(({ isForMpkBus, isForOtherBus }) => isForMpkBus || isForOtherBus);

const myIcon = L.icon({
  iconUrl: markerIconPng,

  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

function findClosest(latlng, stopsList) {
  const distances = stopsList.map((stp) => [haversine1(latlng, [stp.latitude, stp.longitude]), stp]);
  const sorted = distances.sort(([dist1], [dist2]) => dist1 - dist2);

  // console.log(sorted.map(([distance]) => distance));

  return sorted.slice(0, 4);
}

function stopInfo([dist, stp]) {
  return `<li>${stp.stopName} (${(dist * 1000).toFixed(0)}m): ${stp.routeIds.join(', ')}</li>`;
}

function stopLatLng([, stp]) {
  return [stp.latitude, stp.longitude];
}

let clickMarker;

let tramPolyline;

let busPolyline;

let closeEl;

let innerMapInstance;

function removeDistances(mapInstance) {
  if (clickMarker) {
    mapInstance.removeLayer(clickMarker);
  }
  if (tramPolyline) {
    mapInstance.removeLayer(tramPolyline);
  }
  if (busPolyline) {
    mapInstance.removeLayer(busPolyline);
  }
}

function hideInfo() {
  closeEl.removeEventListener('click', hideInfo);
  window.distance.innerHTML = '';
  removeDistances(innerMapInstance);
}

export default function events(mapInstance) {
  innerMapInstance = mapInstance;
  mapInstance.on('click', (ev) => { // eslint-disable-line max-statements
    removeDistances(mapInstance);
    clickMarker = new L.Marker(ev.latlng, {
      icon: myIcon
    });
    mapInstance.addLayer(clickMarker);

    const { latlng: { lat, lng } } = ev;

    const latlng = [lat, lng];

    const closestTramStops = findClosest(latlng, tramStops);
    const closestBusStops = findClosest(latlng, busStops);

    tramPolyline = L.polyline([
      closestTramStops.map((stp) => [latlng, stopLatLng(stp)])
    ], {
      weight: 2,
      color: TRAM_LINE
    });

    busPolyline = L.polyline([
      closestBusStops.map((stp) => [latlng, stopLatLng(stp)])
    ], {
      weight: 2,
      color: BUS_LINE
    });

    mapInstance.addLayer(tramPolyline);
    mapInstance.addLayer(busPolyline);

    window.distance.innerHTML = `
      <div>Closest tram stops:</div>
      <ol>
        ${closestTramStops.map(stopInfo).join('')}
      </ol>
      <div>Closest bus stops:</div>
      <ol>
        ${closestBusStops.map(stopInfo).join('')}
      </ol>
    `;

    closeEl = document.createElement('div');

    closeEl.textContent = 'X';
    closeEl.className = 'distance-close';
    closeEl.addEventListener('click', hideInfo);

    window.distance.append(closeEl);
  });
}
