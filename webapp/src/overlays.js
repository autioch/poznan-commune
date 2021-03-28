/* eslint-disable max-len */
import L from 'leaflet';
import ranges from './data/ranges.json';
import routeLines from './data/routeLines.json';
import agencies from './data/agencies.json';
import stops from './data/stops.json';
import lidlShops from './data/lidlShops.json';
import biedronkaShops from './data/biedronkaShops.json';
import zabkaShops from './data/zabkaShops.json';
import inposts from './data/inposts.json';
import pharmacies from './data/pharmacies.json';
import { TRAM_LINE, BUS_LINE, OTHER_LINE, TRAM_RANGE, BUS_RANGE, OTHER_RANGE, TRAM_STOP, BUS_STOP, OTHER_STOP } from './consts';
import lidlIconPng from './lidl.png';
import biedronkaIconPng from './biedronka.png';
import zabkaIconPng from './zabka.png';
import inpostIconPng from './inpost.png';
import pharmacytIconPng from './pharmacy.png';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;

const lidlIcon = L.icon({
  iconUrl: lidlIconPng,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const biedronkaIcon = L.icon({
  iconUrl: biedronkaIconPng,
  iconSize: [32, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const zabkaIcon = L.icon({
  iconUrl: zabkaIconPng,
  iconSize: [18, 24],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const inpostIcon = L.icon({
  iconUrl: inpostIconPng,
  iconSize: [36, 24],
  iconAnchor: [18, 12],
  popupAnchor: [0, -12]
});

const pharmacyIcon = L.icon({
  iconUrl: pharmacytIconPng,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

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

function getShopPopup(shop) {
  return `<h3>${shop.address}</h3>${shop.openingTimes.map((time) => `<p>${time}</p>`).join('')}`;
}

function featureLayer(feature, icon, popupFn) {
  return L.layerGroup(
    feature.map((item) => L.marker([item.latitude, item.longitude], {
      icon
    }).bindPopup(popupFn(item)))
  );
}

// eslint-disable-next-line max-params
function typeGroupLayer(mapInstance, filterFn, label, lineColor, stopColor, rangeColor, rangesKey) {
  L.control
    .groupedLayers(
      {},
      {
        [label]: {
          Routes: L.polyline(routeLines.filter(filterFn).map(({ points }) => points), {
            color: lineColor,
            weight: 2,
            dashArray: [3, 3]
          }),
          Stops: L.layerGroup(
            stops
              .filter(filterFn)
              .map((stop) => L.circle([stop.latitude, stop.longitude], { // eslint-disable-line no-shadow
                radius: 5,
                color: stopColor,
                weight: 5,
                opacity: 1,
                fillColor: stopColor,
                fillOpacity: 0.5
              }).bindPopup(getStopPopup(stop)))
          )
        },
        [`${label} distance`]: {
          None: renderRange([], rangeColor),
          '100m': renderRange(ranges[rangesKey][100], rangeColor),
          '200m': renderRange(ranges[rangesKey][200], rangeColor),
          '300m': renderRange(ranges[rangesKey][300], rangeColor),
          '400m': renderRange(ranges[rangesKey][400], rangeColor),
          '500m': renderRange(ranges[rangesKey][500], rangeColor)
        }
      },
      {
        exclusiveGroups: [`${label} distance`]
      }
    )
    .addTo(mapInstance);
}

export default function overlays(mapInstance) {
  typeGroupLayer(mapInstance, forTram, 'Tram', TRAM_LINE, TRAM_STOP, TRAM_RANGE, 'trams');
  typeGroupLayer(mapInstance, forMpkBus, 'MPK Bus', BUS_LINE, BUS_STOP, BUS_RANGE, 'mpkBuses');
  typeGroupLayer(mapInstance, forOtherBus, 'Other Bus', OTHER_LINE, OTHER_STOP, OTHER_RANGE, 'otherBuses');

  L.control
    .layers(
      {},
      {
        Lidl: featureLayer(lidlShops, lidlIcon, getShopPopup),
        Apteka: featureLayer(pharmacies, pharmacyIcon, getShopPopup),
        Biedronka: featureLayer(biedronkaShops, biedronkaIcon, getShopPopup),
        Zabka: featureLayer(zabkaShops, zabkaIcon, getShopPopup),
        Inpost: featureLayer(inposts, inpostIcon, getShopPopup)
      }
    )
    .addTo(mapInstance);
}
