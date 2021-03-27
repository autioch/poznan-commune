import L from 'leaflet';
import stops from './data/stops.json';
import lidlShops from './data/lidlShops.json';
import biedronkaShops from './data/biedronkaShops.json';
import { haversine1 } from './haversine';
import { TRAM_LINE, BUS_LINE, LIDL, BIEDRONKA } from './consts';
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

function shopInfo([dist, shop]) {
  return `<li>${shop.address} (${(dist * 1000).toFixed(0)}m)</li>`;
}

function stopLatLng([, stp]) {
  return [stp.latitude, stp.longitude];
}

let clickMarker;

let tramPolyline;

let busPolyline;

let lidlPolyline;

let biedronkaPolyline;

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
  if (lidlPolyline) {
    mapInstance.removeLayer(lidlPolyline);
  }
  if (biedronkaPolyline) {
    mapInstance.removeLayer(biedronkaPolyline);
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

      // draggable: 'true'
    });
    mapInstance.addLayer(clickMarker);

    const { latlng: { lat, lng } } = ev;

    const latlng = [lat, lng];

    const closestTramStops = findClosest(latlng, tramStops);
    const closestBusStops = findClosest(latlng, busStops);
    const closestLidls = findClosest(latlng, lidlShops).slice(0, 2);
    const closestBiedronkas = findClosest(latlng, biedronkaShops).slice(0, 2);

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

    lidlPolyline = L.polyline([
      closestLidls.map((stp) => [latlng, stopLatLng(stp)])
    ], {
      weight: 2,
      color: LIDL
    });

    biedronkaPolyline = L.polyline([
      closestBiedronkas.map((stp) => [latlng, stopLatLng(stp)])
    ], {
      weight: 2,
      color: BIEDRONKA
    });

    mapInstance.addLayer(tramPolyline);
    mapInstance.addLayer(busPolyline);
    mapInstance.addLayer(lidlPolyline);
    mapInstance.addLayer(biedronkaPolyline);

    window.distance.innerHTML = `
      <div>Closest tram stops:</div>
      <ol>
        ${closestTramStops.map(stopInfo).join('')}
      </ol>
      <div>Closest bus stops:</div>
      <ol>
        ${closestBusStops.map(stopInfo).join('')}
      </ol>
      <div>Closest Lidl shops:</div>
      <ol>
        ${closestLidls.map(shopInfo).join('')}
      </ol>
      <div>Closest Biedronka shops:</div>
      <ol>
        ${closestBiedronkas.map(shopInfo).join('')}
      </ol>
    `;

    closeEl = document.createElement('div');

    closeEl.textContent = 'X';
    closeEl.className = 'distance-close';
    closeEl.addEventListener('click', hideInfo);

    window.distance.append(closeEl);
  });
}
