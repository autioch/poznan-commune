/* eslint-disable max-len */
import L from 'leaflet';

import { commune, shops } from './consts';
import agencies from './data/agencies.json';
import ranges from './data/ranges.json';

function renderRange(polygon, color) {
  return L.geoJson(polygon, {
    color,
    fillColor: color,
    fillOpacity: 0.2,
    stroke: false
  });
}

function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
  return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
}

// eslint-disable-next-line max-params
function typeGroupLayer(mapInstance, group) {
  L.control
    .groupedLayers(
      {},
      {
        [group.label]: {
          Routes: L.polyline(group.routeLines.map(({ points }) => points), {
            color: group.color,
            weight: 2,
            dashArray: [3, 3]
          }),
          Stops: L.layerGroup(
            group.items
              .map((stop) => L.circle([stop.latitude, stop.longitude], { // eslint-disable-line no-shadow
                radius: 5,
                color: group.color,
                weight: 5,
                opacity: 1,
                fillColor: group.color,
                fillOpacity: 0.5
              }).bindPopup(getStopPopup(stop)))
          )
        },
        [`${group.label} distance`]: {
          None: renderRange([], group.color),
          '100m': renderRange(ranges[group.rangesKey][100], group.color),
          '200m': renderRange(ranges[group.rangesKey][200], group.color),
          '300m': renderRange(ranges[group.rangesKey][300], group.color),
          '400m': renderRange(ranges[group.rangesKey][400], group.color),
          '500m': renderRange(ranges[group.rangesKey][500], group.color)
        }
      },
      {
        exclusiveGroups: [`${group.label} distance`]
      }
    )
    .addTo(mapInstance);
}

export default function overlays(mapInstance) {
  commune.forEach((group) => typeGroupLayer(mapInstance, group));

  L.control
    .layers(
      {},
      Object.fromEntries(shops.map((shop) => [shop.label, L.layerGroup(
        shop.items.map((item) => L
          .marker([item.latitude, item.longitude], { icon: shop.icon }) // eslint-disable-line object-curly-newline
          .bindPopup(`<h3>${item.address}</h3>${item.openingTimes.map((time) => `<p>${time}</p>`).join('')}`)
        )
      )]))
    )
    .addTo(mapInstance);
}
