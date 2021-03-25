import { readOutput, saveOutput } from './utils.mjs';

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

export default async function getBoundaries() {
  const stops = readOutput('stops');

  const [minLatitude, maxLatitude] = getMaxMin(stops.map(({ latitude }) => parseFloat(latitude)));
  const [minLongitude, maxLongitude] = getMaxMin(stops.map(({ longitude }) => parseFloat(longitude)));

  const boundaries = {
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude
  };

  await saveOutput('boundaries', boundaries, true);
}
