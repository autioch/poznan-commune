/* eslint-disable max-len */
import L from 'leaflet';
import boundaries from './data/boundaries.json';
import debounce from 'lodash.debounce';

const mapbox = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
const maxZoom = 18;
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileTypeId = 'mapbox/streets-v11'; // 'mapbox/satellite-v9'
const tileSize = 512;
const zoomOffset = -1;

const LS_KEY = 'poznan-tram1';

function restoreLatLngZoom(mapInstance) {
  const serialized = localStorage.getItem(LS_KEY);

  if (serialized) {
    const { latlng, zoom } = JSON.parse(serialized);

    mapInstance.setView(latlng, zoom);

    return;
  }

  const { minLatitude, minLongitude, maxLatitude, maxLongitude } = boundaries;

  mapInstance.fitBounds([
    [minLatitude, minLongitude],
    [maxLatitude, maxLongitude]
  ]);
}

const saveLatLngZoom = debounce(({ target }) => {
  const serialized = {
    latlng: target.getCenter(),
    zoom: target.getZoom()
  };

  localStorage.setItem(LS_KEY, JSON.stringify(serialized));
}, 1000);

export default function setupMap() {
  const mapInstance = L.map('map');

  L
    .tileLayer(mapbox, {
      maxZoom,
      attribution,
      id: tileTypeId,
      tileSize,
      zoomOffset
    })
    .addTo(mapInstance);

  restoreLatLngZoom(mapInstance);

  mapInstance.on('zoomend', saveLatLngZoom);
  mapInstance.on('moveend', saveLatLngZoom);

  return mapInstance;
}
