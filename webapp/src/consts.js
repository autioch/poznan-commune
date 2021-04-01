import L from 'leaflet';

import biedronkaShops from './data/biedronkaShops.json';
import inposts from './data/inposts.json';
import lidlShops from './data/lidlShops.json';
import pharmacies from './data/pharmacies.json';
import routeLines from './data/routeLines.json';
import stops from './data/stops.json';
import zabkaShops from './data/zabkaShops.json';
import icons from './icons';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;
const makeIcon = (img, width, height, type) => L.divIcon({
  iconUrl: img,
  iconSize: [width, height],
  popupAnchor: [0, -Math.ceil(height / 2)],
  className: `source-${type}`
});

export const commune = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    count: 4,
    color: '#F0F',
    icon: makeIcon(icons.tram, 16, 16, 'tram'),
    rangesKey: 'trams',
    routeLines: routeLines.filter(forTram)
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: stops.filter(forMpkBus),
    count: 4,
    color: '#FA0',
    icon: makeIcon(icons.bus, 16, 16, 'bus'),
    rangesKey: 'mpkBuses',
    routeLines: routeLines.filter(forMpkBus)
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: stops.filter(forOtherBus),
    count: 4,
    color: '#333',
    icon: makeIcon(icons.otherBus, 16, 16, 'otherBus'),
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus)
  }
];

export const shops = [
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidlShops,
    count: 2,
    color: '#0050AA',
    icon: makeIcon(icons.lidl, 32, 32, 'lidl')
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronkaShops,
    count: 2,
    color: '#E30713',
    icon: makeIcon(icons.biedronka, 32, 48, 'biedronka')
  },
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabkaShops,
    count: 2,
    color: '#01672C',
    icon: makeIcon(icons.zabka, 18, 24, 'zabka')
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inposts,
    count: 1,
    color: '#000000',
    icon: makeIcon(icons.inpost, 36, 24, 'inpost')
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacies,
    count: 2,
    color: '#007F0E',
    icon: makeIcon(icons.pharmacy, 24, 24, 'pharmacy')
  }
];
