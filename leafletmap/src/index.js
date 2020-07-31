import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const latitute = 52.41; // 51.505;
const longitude = 16.92; // -0.09
const mapbox = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
const maxZoom = 18;
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileTypeId = 'mapbox/streets-v11'; // 'mapbox/satellite-v9'
const tileSize = 512;
const zoomOffset = -1;

const mymap = L.map('map')

  // .fitWorld()
  // .setView([latitute,longitude], 13)
  .locate({
    setView: true,
    maxZoom: 16
  });

L.tileLayer(mapbox, {
  maxZoom,
  attribution,
  id: tileTypeId,
  tileSize,
  zoomOffset
}).addTo(mymap);

const marker = L.marker([latitute, longitude]).addTo(mymap);

const circle = L.circle([latitute, longitude], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(mymap);

const polygon = L.polygon([
  [latitute - 0.01, longitude - 0.01],
  [latitute, longitude - 0.01],
  [latitute - 0.01, longitude]
]).addTo(mymap);

marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
circle.bindPopup('I am a circle.');
polygon.bindPopup('I am a polygon.');

const popup = L.popup()
  .setLatLng([latitute - 0.04, longitude + 0.01])
  .setContent('I am a standalone popup.')
  .openOn(mymap);

function onMapClick(ev) {
  popup
    .setLatLng(ev.latlng)
    .setContent(`You clicked the map at ${ev.latlng.toString()}`)
    .openOn(mymap);
}

mymap.on('click', onMapClick);

function onLocationFound(e) {
  const radius = e.accuracy;

  L.marker(e.latlng).addTo(mymap)
    .bindPopup(`You are within ${radius} meters from this point`)
    .openPopup();

  L.circle(e.latlng, radius).addTo(mymap);
}

mymap.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message); // eslint-disable-line no-alert
}

mymap.on('locationerror', onLocationError);
