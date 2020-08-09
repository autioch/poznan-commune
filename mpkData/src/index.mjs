import getAgencies from './getAgencies.mjs';
import getBoundaries from './getBoundaries.mjs';
import getStops from './getStops.mjs';
import getRouteLines from './getRouteLines.mjs';
import getRanges from './getRanges.mjs';

(async () => {
  console.log('agencies');
  await getAgencies();

  console.log('boundaries');
  await getBoundaries();

  console.log('stops');
  await getStops();

  console.log('routeLines');
  await getRouteLines();

  // uses stops
  console.log('ranges');
  await getRanges();
})();
