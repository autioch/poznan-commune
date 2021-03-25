import { mapAgencies, mapBoundaries, mapRanges, mapRouteLines, mapStops } from './mappers.mjs';
import { getDbTable, readOutput, saveOutput } from './utils.mjs';

async function prepareWebData(fileName, mappingFn, tableNames, outputNames = []) {
  const tables = tableNames.map(getDbTable);
  const outputs = outputNames.map(readOutput);

  console.log(fileName);
  console.time(fileName);
  const mapped = mappingFn(...tables, ...outputs);

  console.timeLog(fileName, 'mapped');

  await saveOutput(fileName, mapped);
  console.timeEnd(fileName);
}

(async () => {
  await prepareWebData('agencies', mapAgencies, ['agency']);

  // await prepareWebData('stops', mapStops, ['stops', 'stop_times', 'routes', 'trips']);
  // await prepareWebData('routeLines', mapRouteLines, ['shapes', 'routes', 'trips']);
  // await prepareWebData('boundaries', mapBoundaries, [], ['stops']);
  // await prepareWebData('ranges', mapRanges, [], ['stops']);
})();
