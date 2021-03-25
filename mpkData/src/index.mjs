import getAgencies from './getAgencies.mjs';
import getBoundaries from './getBoundaries.mjs';
import getRanges from './getRanges.mjs';
import getRouteLines from './getRouteLines.mjs';
import getStops from './getStops.mjs';

(async () => {
  console.log('agencies');
  await getAgencies();

  console.log('stops');
  await getStops();

  console.log('routeLines');
  await getRouteLines();

  // uses stops
  console.log('boundaries');
  await getBoundaries();

  console.log('ranges');
  await getRanges();
})();
