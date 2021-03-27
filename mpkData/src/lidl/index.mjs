import { require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

// Result of uri in a <script>
// https://docs.microsoft.com/en-us/previous-versions/bing/wpf-control/hh757509(v=msdn.10)
// https://spatial.virtualearth.net/REST/v1/data/f4c8c3e0d96748348fe904413a798be3/Filialdaten-PL/Filialdaten-PL?spatialFilter=nearby(52.4335664,16.9163686,10)&$filter=Adresstyp%20Eq%201&$top=101&$format=json&$skip=0&key=AnZ7UrM33kcHeNxFJsJ6McC4-iAx6Mv55FfsAzmlImV6eJ1n6OX4zfhe2rsut6CD&Jsonp=displayResultStores
// from https://www.lidl.pl/informacje-dla-klienta/znajdz-sklep

const data = require('./lidl/raw.json');

const shops = data.d.results.map((shop) => ({
  id: shop.EntityID,
  longitude: shop.Longitude,
  latitude: shop.Latitude,
  locality: shop.Locality,
  address: shop.AddressLine,
  openingTimes: shop.OpeningTimes.split(',').map((time) => time.trim())
}));

console.log(`Found ${shops.length} Lidl shops.`);

saveOutput('lidlShops', shops, true);
