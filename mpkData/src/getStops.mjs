import { BUS_ROUTE, TRAM_ROUTE } from './consts.mjs';
import { getDbTable, isDailyRoute, saveOutput } from './utils.mjs';

export default async function getStops() {
  const stopTimes = getDbTable('stop_times');
  const routes = getDbTable('routes');
  const routeMap = new Map(routes.map((route) => [route.route_id, route]));
  const busRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE).map(({ route_id }) => route_id));
  const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(({ route_id }) => route_id));
  const tripMap = new Map(getDbTable('trips').map((trip) => [trip.trip_id, trip]));
  const getRouteId = ({ trip_id }) => tripMap.get(trip_id).route_id;
  const getAgencyId = (routeId) => routeMap.get(routeId).agency_id;
  const isBusRoute = (routeId) => busRouteIds.has(routeId);
  const isTramRoute = (routeId) => tramRouteIds.has(routeId);

  const stops = getDbTable('stops')
    .map((stopItem) => ({
      ...stopItem,
      routeIds: [...new Set(stopTimes.filter((stopTime) => stopTime.stop_id === stopItem.stop_id).map(getRouteId))].filter(isDailyRoute).sort()
    }))
    .filter(({ routeIds }) => routeIds.length > 0)
    .map(({ stop_id, stop_name, stop_lat, stop_lon, zone_id, routeIds }) => ({
      stopId: stop_id,
      stopName: stop_name,
      latitude: stop_lat,
      longitude: stop_lon,
      zoneId: zone_id,
      routeIds,
      agencyIds: [...new Set(routeIds.map(getAgencyId))],
      isForBus: routeIds.some(isBusRoute),
      isForTram: routeIds.some(isTramRoute)
    }))
    .sort((a, b) => a.stopName.localeCompare(b.stopName));

  await saveOutput('stops', stops);
}
