import L from 'leaflet';

import { commune, shops } from './consts';
import { haversine1 } from './haversine';
import icons from './icons';

const all = [...commune, ...shops];

const myIcon = L.icon({
  iconUrl: icons.smile,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let clickMarker;

let closeEl;

let polylines = [];

function removeDistances(mapInstance) {
  if (clickMarker) {
    mapInstance.removeLayer(clickMarker);
    clickMarker = null;
  }
  polylines.forEach((polyline) => mapInstance.removeLayer(polyline));
  polylines = [];
}

function showDistances(mapInstance, latlng) {
  polylines = all.map((source) => L.polyline([
    source.closest.map(([, item]) => [latlng, [item.latitude, item.longitude] ])
  ], {
    weight: 2,
    color: source.color
  }));

  polylines.forEach((polyline) => mapInstance.addLayer(polyline));
}

function stopInfo([dist, stp]) {
  return `<li>${stp.stopName} (${(dist * 1000).toFixed(0)}m): ${stp.routeIds.join(', ')}</li>`;
}

function shopInfo([dist, shop]) {
  return `<li>${shop.address} (${(dist * 1000).toFixed(0)}m)</li>`;
}

function showInfo(mapInstance) {
  const communeHtml = commune
    .map((source) => `<div>${source.label}</div><ol>${source.closest.map(stopInfo).join('')}</ol>`)
    .join('');

  const shopsHtml = shops
    .map((source) => `<div>${source.label}</div><ol>${source.closest.map(shopInfo).join('')}</ol>`)
    .join('');

  window.distance.innerHTML = [...communeHtml, ...shopsHtml];

  closeEl = document.createElement('div');

  function hideInfo() {
    closeEl.removeEventListener('click', hideInfo);
    window.distance.innerHTML = '';
    removeDistances(mapInstance);
  }

  closeEl.textContent = 'X';
  closeEl.className = 'distance-close';
  closeEl.addEventListener('click', hideInfo);

  window.distance.append(closeEl);
}

function setupClosest([lat, lng]) {
  const latlng = [lat, lng];

  all.forEach((source) => {
    const distances = source.items.map((item) => [haversine1(latlng, [item.latitude, item.longitude]), item]);

    distances.sort(([dist1], [dist2]) => dist1 - dist2);
    source.closest = distances.slice(0, source.count);
  });
}

export default function showClosest(mapInstance, latlng) {
  removeDistances(mapInstance);

  clickMarker = new L.Marker(latlng, { // todo can be array or has to be object?
    icon: myIcon
  });

  mapInstance.addLayer(clickMarker);

  setupClosest(latlng);
  showDistances(mapInstance, latlng);
  showInfo(mapInstance);
}
