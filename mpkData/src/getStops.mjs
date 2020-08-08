// import { MPK_AGENCY, TRAM_ROUTE, BUS_ROUTE } from './consts.mjs';
import getDbTable from './getDbTable.mjs';
import saveOutput from './saveOutput.mjs';
import { TRAM_ROUTE, BUS_ROUTE } from './consts.mjs';

(async () => {
  const stopTimes = getDbTable('stop_times');
  const routes = getDbTable('routes');
  const routeMap = new Map(routes.map((route) => [route.route_id, route]));
  const busRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE).map(({ route_id }) => route_id));
  const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(({ route_id }) => route_id));
  const tripMap = new Map(getDbTable('trips').map((trip) => [trip.trip_id, trip]));
  const getRouteId = ({ trip_id }) => tripMap.get(trip_id).route_id;
  const getAgencyId = (routeId) => routeMap.get(routeId).agency_id;
  const isNightRoute = (routeId) => routeId.length === 3 && (routeId.startsWith('2') || routeId === '100');
  const isBusRoute = (routeId) => !isNightRoute(routeId) && busRouteIds.has(routeId);
  const isTramRoute = (routeId) => !isNightRoute(routeId) && tramRouteIds.has(routeId);

  const stops = getDbTable('stops')
    .map(({ stop_id, stop_name, stop_lat, stop_lon, zone_id }) => {
      const routeIds = [...new Set(stopTimes.filter((stopTime) => stopTime.stop_id === stop_id).map(getRouteId))].sort();

      return {
        stopId: stop_id,
        stopName: stop_name,
        latitude: stop_lat,
        longitude: stop_lon,
        zoneId: zone_id,
        routeIds,
        agencyIds: [...new Set(routeIds.map(getAgencyId))],
        isForBus: routeIds.some(isBusRoute),
        isForTram: routeIds.some(isTramRoute)
      };
    })
    .sort((a, b) => a.stopName.localeCompare(b.stopName));

  await saveOutput('stops', stops);
})();
