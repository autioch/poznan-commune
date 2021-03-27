import cheerio from 'cheerio';

import forwardGeocode from '../forwardGeocode.mjs';
import { getPage, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const PAGE_COUNT = 4;

const ID_REGEX = / a href="\/pl\/shop,id,(\d+),title,.+" class="showShopOnMap">Zobacz więcej<\/a /;

function getShopId(commentEl, pageIndex, shopIndex) {
  const [, id] = commentEl.data.match(ID_REGEX) || [];

  return id || `${pageIndex}-${shopIndex}`;
}

function getShopList(html, pageIndex) {
  const $ = cheerio.load(html);

  const shopList = $('.shopListElement').get().map((el, shopIndex) => {
    const $shop = $(el);
    const address = $shop.find('.shopAddress').text();
    const locality = $shop.find('h4').text().replace(address, '').trim();
    const commentEl = $shop.contents().get().find((ele) => ele.type === 'comment');

    return {
      id: getShopId(commentEl, pageIndex, shopIndex),
      longitude: null,
      latitude: null,
      locality,
      address,
      openingTimes: $shop.find('p').html().split('<br>').map((text) => $(text.trim()).text()).slice(1, -1)
    };
  });

  return shopList;
}

async function geoLocateShop(shop) {
  const result = await forwardGeocode(shop.address, shop.locality);

  if (!result) {
    return;
  }

  const { lat, lng } = result;

  shop.latitude = lat;
  shop.longitude = lng;
}

(async () => {
  const reqs = new Array(PAGE_COUNT).fill(null).map((el, i) => getPage(`https://www.biedronka.pl/pl/sklepy/lista,city,poznan,page,${i + 1}`)); // eslint-disable-line no-unused-vars

  const htmls = await Promise.all(reqs);
  const shopList = htmls.flatMap(getShopList);

  console.log(`Found ${shopList.length} Biedronka shops.`);

  const geocodeReqs = shopList.map(geoLocateShop);

  await Promise.all(geocodeReqs);

  saveOutput('biedronkaShops', shopList, true);
})();
