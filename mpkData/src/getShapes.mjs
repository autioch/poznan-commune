/* eslint-disable no-underscore-dangle */
// import CSVWriter from 'csv-writer';
import fs from 'fs';
import dirName from './dirName.mjs';
import { createRequire } from 'module';
import { join } from 'path';

const __dirname = dirName(import.meta); // eslint-disable-line no-shadow
const require = createRequire(import.meta.url); // eslint-disable-line no-shadow
const cache = {};
const getTable = (tableName) => cache[tableName] || (cache[tableName] = require(join(__dirname, 'db', `${tableName}.json`)));

// arrays have 200000 items, no spread or math.min/max
function getMaxMin(arr) {
  let [min, max] = arr;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    min = min > item ? item : min;
    max = max > item ? max : item;
  }

  return [min, max];
}

const sortPoints = ([a], [b]) => a - b;

function extractRouteIds(shapeIds) {
  const shapeSet = new Set(shapeIds);

  const matchingRouteIds = getTable('trips')
    .filter(({ shape_id }) => shapeSet.has(shape_id))
    .map(({ route_id }) => route_id)
    .sort();

  return [...new Set(matchingRouteIds)];
}

function getShapesArray(shapeTable) {
  const shapesDict = shapeTable.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
    if (!obj[shape_id]) {
      obj[shape_id] = [];
    }
    obj[shape_id].push([shape_pt_sequence, parseFloat(shape_pt_lat), parseFloat(shape_pt_lon)]);

    return obj;
  }, {});

  const uniqueShapeDict = {};

  Object.entries(shapesDict).forEach(([id, rawPoints]) => {
    const points = rawPoints.sort(sortPoints).map(([, x, y]) => [x, y]);
    const pointsHash1 = JSON.stringify(points);
    const pointsHash2 = JSON.stringify(points.reverse());

    if (uniqueShapeDict[pointsHash1]) {
      uniqueShapeDict[pointsHash1].push(id);
    } else if (uniqueShapeDict[pointsHash2]) {
      uniqueShapeDict[pointsHash2].push(id);
    } else {
      uniqueShapeDict[pointsHash1] = [id];
    }
  });

  return Object.entries(uniqueShapeDict).map(([pointsHash, ids]) => ({
    points: JSON.parse(pointsHash),
    routeIds: extractRouteIds(ids)
  }));
}

(async () => {
  const routes = getTable('routes').reduce((obj, route) => {
    obj[route.route_id] = route;

    return obj;
  }, {});
  const shapes = getTable('shapes');

  // const [minY, maxY] = getMaxMin(shapes.map(({ shape_pt_lat }) => parseFloat(shape_pt_lat)));
  // const [minX, maxX] = getMaxMin(shapes.map(({ shape_pt_lon }) => parseFloat(shape_pt_lon)));

  const [minX, maxX] = getMaxMin(shapes.map(({ shape_pt_lat }) => parseFloat(shape_pt_lat)));
  const [minY, maxY] = getMaxMin(shapes.map(({ shape_pt_lon }) => parseFloat(shape_pt_lon)));

  const shapeDefinitions = getShapesArray(shapes);

  console.log(shapes.length, shapeDefinitions.length);

  // TODO Find duplicated paths.
  // const shapesJSONS = shapeDefinitions.map(s => JSON.stringify(s))

  await fs.promises.writeFile(join(__dirname, '..', 'leafletmap', 'src', 'shapesParsed.json'), JSON.stringify({
    minX,
    maxX,
    minY,
    maxY,
    shapes: shapeDefinitions,
    routes
  }));
})();
