/* eslint-disable no-alert */
import './currentLocation.scss';
import tag from 'lean-tag';

import icons from './icons';

function error() {
  alert('Unable to retrieve your location');
}

function showCurrentLocation(mapInstance) {
  function success(position) {
    const { latitude, longitude } = position.coords;

    mapInstance.setView([latitude, longitude]);

    mapInstance.fireEvent('click', {
      latlng: {
        lat: latitude,
        lng: longitude
      }

      // layerPoint: mapInstance.latLngToLayerPoint([latitude, longitude]),
      // containerPoint: mapInstance.latLngToContainerPoint([latitude, longitude])
    });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('Geolocation is not supported by your browser');
  }
}

export default function currentLocation(mapInstance) {
  const setEl = tag(
    'div.current-location',
    {
      onclick: () => showCurrentLocation(mapInstance)
    },
    tag('img.current-location__img', {
      src: icons.currentLocation
    })
  );

  document.body.append(setEl);
}
