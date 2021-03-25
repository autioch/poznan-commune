/* eslint-disable no-underscore-dangle */
import { BUS_ROUTE, MPK_AGENCY, TRAM_ROUTE } from './consts.mjs';
import { getDbTable, isDailyRoute, saveOutput } from './utils.mjs';

const sortPoints = ([a], [b]) => a - b;

function extractRouteIds(shapeIds) {
  const shapeSet = new Set(shapeIds);

  const matchingRouteIds = getDbTable('trips')
    .filter(({ shape_id }) => shapeSet.has(shape_id))
    .map(({ route_id }) => route_id)
    .sort();

  return [...new Set(matchingRouteIds)];
}

export default async function getRouteLines() {
  const shapeTable = getDbTable('shapes');
  const shapesDict = shapeTable.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
    if (!obj[shape_id]) {
      obj[shape_id] = [];
    }
    obj[shape_id].push([shape_pt_sequence, parseFloat(shape_pt_lat), parseFloat(shape_pt_lon)]);

    return obj;
  }, {});

  const uniqueShapeDict = {};

  Object.entries(shapesDict).forEach(([shapeId, rawPoints]) => {
    const points = rawPoints.sort(sortPoints).map(([, x, y]) => [x, y]);
    const pointsHash1 = JSON.stringify(points);
    const pointsHash2 = JSON.stringify(points.reverse());

    if (uniqueShapeDict[pointsHash1]) {
      uniqueShapeDict[pointsHash1].push(shapeId);
    } else if (uniqueShapeDict[pointsHash2]) {
      uniqueShapeDict[pointsHash2].push(shapeId);
    } else {
      uniqueShapeDict[pointsHash1] = [shapeId];
    }
  });

  const routesMap = new Map(getDbTable('routes').map((route) => [route.route_id, route]));

  const routeLines = Object.entries(uniqueShapeDict)
    .map(([pointsHash, shapeIds]) => {
      const routeIds = extractRouteIds(shapeIds).filter(isDailyRoute);

      if (routeIds.length === 0) {
        return false;
      }

      const isForTram = routeIds.some((routeId) => routesMap.get(routeId).route_type === TRAM_ROUTE);
      const isForMpkBus = routeIds.some((routeId) => routesMap.get(routeId).route_type === BUS_ROUTE && routesMap.get(routeId).agency_id === MPK_AGENCY);
      const isForOtherBus = routeIds.some((routeId) => routesMap.get(routeId).route_type === BUS_ROUTE && routesMap.get(routeId).agency_id !== MPK_AGENCY);

      return {
        points: JSON.parse(pointsHash),
        routeIds,
        isForTram,
        isForMpkBus,
        isForOtherBus
      };
    })
    .filter(Boolean);

  await saveOutput('routeLines', routeLines);
}
