/* eslint-disable max-len */
import L from 'leaflet';
import boundaries from './data/boundaries.json';

const mapbox = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
const maxZoom = 18;
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileTypeId = 'mapbox/streets-v11'; // 'mapbox/satellite-v9'
const tileSize = 512;
const zoomOffset = -1;

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

  const { minLatitude, minLongitude, maxLatitude, maxLongitude } = boundaries;

  mapInstance.fitBounds([
    [minLatitude, minLongitude],
    [maxLatitude, maxLongitude]
  ]);

  return mapInstance;
}
