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
const makeIcon = (img, width, height) => L.icon({
  iconUrl: img,
  iconSize: [width, height],
  popupAnchor: [0, -Math.ceil(height / 2)]
});

export const commune = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    measureCount: 4,
    color: '#F0F',
    iconRaw: icons.tram,
    icon: makeIcon(icons.tram, 16, 16, 'tram'),
    rangesKey: 'trams',
    routeLines: routeLines.filter(forTram),
    isVisible: false,
    isMeasured: false,
    showRange: 0
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: stops.filter(forMpkBus),
    measureCount: 4,
    color: '#FA0',
    iconRaw: icons.bus,
    icon: makeIcon(icons.bus, 16, 16, 'bus'),
    rangesKey: 'mpkBuses',
    routeLines: routeLines.filter(forMpkBus),
    isVisible: false,
    isMeasured: false,
    showRange: 0
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: stops.filter(forOtherBus),
    measureCount: 4,
    color: '#333',
    iconRaw: icons.otherBus,
    icon: makeIcon(icons.otherBus, 16, 16, 'otherBus'),
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus),
    isVisible: false,
    isMeasured: false,
    showRange: 0
  }
];

export const shops = [
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidlShops,
    measureCount: 2,
    color: '#0050AA',
    iconRaw: icons.lidl,
    icon: makeIcon(icons.lidl, 32, 32, 'lidl'),
    isVisible: false,
    isMeasured: false
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronkaShops,
    measureCount: 2,
    color: '#E30713',
    iconRaw: icons.biedronka,
    icon: makeIcon(icons.biedronka, 32, 48, 'biedronka'),
    isVisible: false,
    isMeasured: false
  },
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabkaShops,
    measureCount: 2,
    color: '#01672C',
    iconRaw: icons.zabka,
    icon: makeIcon(icons.zabka, 18, 24, 'zabka'),
    isVisible: false,
    isMeasured: false
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inposts,
    measureCount: 1,
    color: '#000000',
    iconRaw: icons.inpost,
    icon: makeIcon(icons.inpost, 36, 24, 'inpost'),
    isVisible: false,
    isMeasured: false
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacies,
    measureCount: 2,
    color: '#007F0E',
    iconRaw: icons.pharmacy,
    icon: makeIcon(icons.pharmacy, 24, 24, 'pharmacy'),
    isVisible: false,
    isMeasured: false
  }
];
