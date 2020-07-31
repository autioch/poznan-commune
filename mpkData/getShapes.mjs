// import CSVWriter from 'csv-writer';
import fs from 'fs/promises';
import dirName from './dirName.mjs';
import { createRequire } from 'module';
import { join } from 'path';
import { MPK_AGENCY, TRAM_ROUTE, BUS_ROUTE } from './consts.mjs';

const __dirname = dirName(import.meta);
const require = createRequire(import.meta.url);
const cache = {};
const getTable = (tableName) => cache[tableName] || (cache[tableName] = require(join(__dirname, 'db', `${tableName}.json`)));



// arrays have 200000 items, no spread or math.min/max
function getMaxMin(arr){
  let min = arr[0];
  let max = arr[1];

  for (let i = 0; i < arr.length; i++){
    const item = arr[i];
    min = min > item ? item : min;
    max = max > item ? max : item;
  }
  return [min, max];
}


    // "shape_id": "182073",
    // "shape_pt_lat": "52.468901626052",
    // "shape_pt_lon": "16.980142487671",
    // "shape_pt_sequence": "0"

(async () => {
  const routes = getTable('routes').reduce((obj, route) => {
      obj[route.route_id] = route;
      return obj;
    }, {});
  const trips = getTable('trips');
  const shapes = getTable('shapes');

  const [minY, maxY] = getMaxMin(shapes.map(({shape_pt_lat}) => parseFloat(shape_pt_lat)));
  const [minX, maxX] = getMaxMin(shapes.map(({shape_pt_lon}) => parseFloat(shape_pt_lon)));
  //
  // const [minX, maxX] = getMaxMin(shapes.map(({shape_pt_lat}) => parseFloat(shape_pt_lat)));
  // const [minY, maxY] = getMaxMin(shapes.map(({shape_pt_lon}) => parseFloat(shape_pt_lon)));
  const extractRouteId = ({route_id})=> route_id;
  const getAgency = route_id => routes[route_id].agency_id;

  const shapesDict = shapes.reduce((obj, {shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence}) => {
    if (!obj[shape_id]){ obj[shape_id] = [] };
    obj[shape_id].push([shape_pt_sequence, shape_pt_lon, shape_pt_lat]);
    return obj;
  }, {});

  const getShapeInfo = (id) => {
    const routeIds = [...new Set(trips.filter(({shape_id}) => shape_id === id).map(extractRouteId))];
    const agencies = routeIds.map(getAgency);

    if (agencies.length > 1){
      console.log('Multiple agencies', id, routeIds, agencies);
    }

    return {
      agency: parseInt(agencies[0], 10),
      routeIds
    }
  };

  const sortPoints = ([a], [b]) => a < b;
  const shapeDefinitions = Object.entries(shapesDict)
    .map(([id, points]) => ({
      id,
      points: points.sort(sortPoints).map(([,x,y]) => [x,y]),
      ...getShapeInfo(id)
    }));

    // TODO Find duplicated paths.
    // const shapesJSONS = shapeDefinitions.map(s => JSON.stringify(s))

  await fs.writeFile(join(__dirname, 'shapesParsed.json'), JSON.stringify({
    minX, maxX,
    minY, maxY,
    shapes: shapeDefinitions,
    routes
  }));
})()
