import { getDbTable, saveOutput } from './utils.mjs';

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

(async () => {
  const shapes = getDbTable('shapes');

  const [minLatitude, maxLatitude] = getMaxMin(shapes.map(({ shape_pt_lat }) => parseFloat(shape_pt_lat)));
  const [minLongitude, maxLongitude] = getMaxMin(shapes.map(({ shape_pt_lon }) => parseFloat(shape_pt_lon)));

  const boundaries = {
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude
  };

  await saveOutput('boundaries', boundaries, true);
})();
