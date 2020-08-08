import L from 'leaflet';

const latitute = 52.41; // 51.505;
const longitude = 16.92; // -0.09

export default function examples(mapInstance) {
  const marker = L.marker([latitute, longitude]).addTo(mapInstance);

  const circle = L.circle([latitute, longitude], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(mapInstance);

  const polygon = L.polygon([
    [latitute - 0.01, longitude - 0.01],
    [latitute, longitude - 0.01],
    [latitute - 0.01, longitude]
  ]).addTo(mapInstance);

  marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
  circle.bindPopup('I am a circle.');
  polygon.bindPopup('I am a polygon.');

  const popup = L.popup()
    .setLatLng([latitute - 0.04, longitude + 0.01])
    .setContent('I am a standalone popup.')
    .openOn(mapInstance);

  function onMapClick(ev) {
    popup
      .setLatLng(ev.latlng)
      .setContent(`You clicked the map at ${ev.latlng.toString()}`)
      .openOn(mapInstance);
  }

  mapInstance.on('click', onMapClick);

  function onLocationFound(e) {
    const radius = e.accuracy;

    L.marker(e.latlng).addTo(mapInstance)
      .bindPopup(`You are within ${radius} meters from this point`)
      .openPopup();

    L.circle(e.latlng, radius).addTo(mapInstance);
  }

  mapInstance.on('locationfound', onLocationFound);

  function onLocationError(e) {
    alert(e.message); // eslint-disable-line no-alert
  }

  mapInstance.on('locationerror', onLocationError);
}
