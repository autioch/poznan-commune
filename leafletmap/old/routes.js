// import agencies from './agency.json';
import shapesParsed from './data/shapesParsed.json';

// import L from 'leaflet';
//
// const tramConfig = {
//   color: '#f0f',
//   weight: 3,
//   dashArray: [2, 2]
// };
//
// const mpkBus = {
//   color: '#9c0',
//   weight: 1,
//   dashArray: [2, 2]
// };
//
// const otherBus = {
//   color: '#000',
//   weight: 1,
//   dashArray: [2, 2]
// };

export default function renderRoutes(mapInstance) {
  // const TRAM_ROUTE = '0';
  // const BUS_ROUTE = '3';
  // const AGENCY_COLORS = {
  //   '2': 'rgba(0,   0, 0, 0.25)',
  //   '4': 'rgba(255, 0, 0, 0.25)',
  //   '5': 'rgba(0, 255, 0, 0.25)',
  //   '6': 'rgba(0, 0, 255, 0.25)',
  //   '7': 'rgba(255, 255, 0, 0.25)',
  //   '8': 'rgba(255, 0, 255, 0.25)',
  //   '9': 'rgba(0, 255, 255, 0.25)',
  //   '10': 'rgba(127, 0, 0, 0.25)',
  //   '11': 'rgba(0, 127, 0, 0.25)',
  //   '12': 'rgba(0, 0, 127, 0.25)'
  // };

  const { minX, minY, maxX, maxY, shapes, routes } = shapesParsed; // eslint-disable-line no-unused-vars

  // const trams = shapes.filter(({ routeIds }) => routeIds.some((routeId) => routes[routeId].route_type == TRAM_ROUTE));
  // const mpkBuses = shapes.filter(({ routeIds }) => routeIds.some((routeId) => routes[routeId].route_type != TRAM_ROUTE && routes[routeId].agency_id == '2'));
  // const otherBuses = shapes.filter(({ routeIds }) => routeIds.some((routeId) => routes[routeId].route_type != TRAM_ROUTE && routes[routeId].agency_id != '2'));

  // otherBuses.forEach(({ points, routeIds }) => L.polyline(points, otherBus).addTo(mapInstance).bindPopup(routeIds.join(', ')));
  // trams.forEach(({ points, routeIds }) => L.polyline(points, tramConfig).addTo(mapInstance).bindPopup(routeIds.join(', ')));
  // mpkBuses.forEach(({ points, routeIds }) => L.polyline(points, mpkBus).addTo(mapInstance).bindPopup(routeIds.join(', ')));

  mapInstance.fitBounds([ [minX, minY], [maxX, maxY] ]);
}
