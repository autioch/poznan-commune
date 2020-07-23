// import CSVWriter from 'csv-writer';
import fs from 'fs/promises';
import dirName from './dirName.mjs';
import { createRequire } from 'module';
import { join } from 'path';
import { MPK_AGENCY, TRAM_ROUTE, BUS_ROUTE, STOPS_CSV_HEADER } from './consts.mjs';

const __dirname = dirName(import.meta);
const require = createRequire(import.meta.url);
const cache = {};
const getTable = (tableName) => cache[tableName] || (cache[tableName] = require(join(__dirname, 'db', `${tableName}.json`)));

(async () => {
  const routes = new Map(getTable('routes').filter(({route_type, agency_id}) => agency_id === MPK_AGENCY && route_type === TRAM_ROUTE).map(route => [route.route_id, route]));
  const trips = new Map(getTable('trips').filter(({route_id}) => routes.has(route_id)).map(trip => [trip.trip_id, trip]));
  const stopTimes =  getTable('stop_times').filter(({trip_id}) => trips.has(trip_id));
  const stops = getTable('stops')
    .filter(({stop_id}) => stopTimes.some(stopTime => stopTime.stop_id === stop_id))
    .sort((a,b) => a.stop_name.localeCompare(b.stop_name));


await    fs.writeFile(join(__dirname, 'stops.json'), JSON.stringify(stops));
  // const csvWriter =  CSVWriter.createObjectCsvWriter({
  //   path: join(__dirname, 'stops.csv'),
  //   header: STOPS_CSV_HEADER
  // })
  //
  // await csvWriter.writeRecords(stops);
})()
