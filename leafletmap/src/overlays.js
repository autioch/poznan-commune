/* eslint-disable max-len */
import L from 'leaflet';
import ranges from './data/ranges.json';
import routeLines from './data/routeLines.json';
import agencies from './data/agencies.json';
import stops from './data/stops.json';
import { TRAM_LINE, BUS_LINE, OTHER_LINE, TRAM_RANGE, BUS_RANGE, OTHER_RANGE, TRAM_STOP, BUS_STOP, OTHER_STOP } from './consts';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;

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
}
