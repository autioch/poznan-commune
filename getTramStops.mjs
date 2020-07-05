import getTable from './data/getTable.mjs';
import CSVWriter from 'csv-writer';
import fs from 'fs/promises';

const MPK_AGENCY = '2';
const TRAM_ROUTE = '0';
const CSV_HEADER = [
  {id: 'stop_id', title: 'id'},
  {id: 'stop_code', title: 'code'},
  {id: 'stop_name', title: 'name'},
  {id: 'stop_lat', title: 'lat'},
  {id: 'stop_lon', title: 'lon'},
  {id: 'zone_id', title: 'zone_id'},
];


async function stopsCsv(tramStops){
  const csvWriter =  CSVWriter.createObjectCsvWriter({
    path: './tramStops.csv',
    header: CSV_HEADER
  })

  await csvWriter.writeRecords(tramStops);
}

(async () => {
  const routes  = await getTable('routes');
  const routeMap =  new Map(routes.filter(({route_type, agency_id}) => route_type === TRAM_ROUTE && agency_id === MPK_AGENCY).map(route => [route.route_id, route]));

  const trips = await getTable('trips');
  const tripMap =  new Map(trips.filter(({route_id}) => routeMap.has(route_id)).map(trip => [trip.trip_id, trip]));

  const stopTimes = await getTable('stop_times');
  const stopIds =  new Set(stopTimes.filter(({trip_id}) => tripMap.has(trip_id)).map(({stop_id}) => stop_id));

  const stops = await getTable('stops');
  const tramStops = stops.filter(({stop_id}) => stopIds.has(stop_id)).sort((a,b) => a.stop_name.localeCompare(b.stop_name));

  const csvWriter =  CSVWriter.createObjectCsvWriter({
    path: './tramStops.csv',
    header: CSV_HEADER
  })

  await csvWriter.writeRecords(tramStops);
})()
