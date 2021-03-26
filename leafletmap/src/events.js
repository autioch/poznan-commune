import stops from './data/stops.json';
import { haversine1 } from './haversine';

const tramStops = stops.filter(({ isForTram }) => isForTram);
const busStops = stops.filter(({ isForMpkBus, isForOtherBus }) => isForMpkBus || isForOtherBus);

function findClosest(latlng, stopsList) {
  const distances = stopsList.map((stp) => [haversine1(latlng, [stp.latitude, stp.longitude]), stp]);
  const sorted = distances.sort(([dist1], [dist2]) => dist1 - dist2);

  // console.log(sorted.map(([distance]) => distance));

  return sorted;
}

function stopInfo(stp) {
  return `<li>${stp[1].stopName} (${stp[0].toFixed(2)}km): ${stp[1].routeIds.join(', ')}</li>`;
}

export default function events(mapInstance) {
  mapInstance.on('click', (ev) => {
    const { latlng: { lat, lng } } = ev;

    const latlng = [lat, lng];

    const [tram1, tram2, tram3] = findClosest(latlng, tramStops);
    const [bus1, bus2, bus3] = findClosest(latlng, busStops);

    window.distance.innerHTML = `
      <div>Closest tram stops:</div>
      <ol>
        ${stopInfo(tram1)}
        ${stopInfo(tram2)}
        ${stopInfo(tram3)}
      </ol>
      <div>Closest bus stops:</div>
      <ol>
        ${stopInfo(bus1)}
        ${stopInfo(bus2)}
        ${stopInfo(bus3)}
      </ol>
    `;
  });
}
