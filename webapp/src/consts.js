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

export const commune = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    count: 4,
    color: '#F0F',
    icon: false,
    rangesKey: 'trams',
    routeLines: routeLines.filter(forTram)
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: stops.filter(forMpkBus),
    count: 4,
    color: '#FA0',
    icon: false,
    rangesKey: 'mpkBuses',
    routeLines: routeLines.filter(forMpkBus)
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: stops.filter(forOtherBus),
    count: 4,
    color: '#333',
    icon: false,
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus)
  }
];

export const shops = [
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidlShops,
    count: 4,
    color: '#0050AA',
    icon: L.icon({
      iconUrl: icons.lidl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronkaShops,
    count: 4,
    color: '#E30713',
    icon: L.icon({
      iconUrl: icons.biedronka,
      iconSize: [32, 48],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabkaShops,
    count: 4,
    color: '#01672C',
    icon: L.icon({
      iconUrl: icons.zabka,
      iconSize: [18, 24],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inposts,
    count: 4,
    color: '#000000',
    icon: L.icon({
      iconUrl: icons.inpost,
      iconSize: [36, 24],
      iconAnchor: [18, 12],
      popupAnchor: [0, -12]
    })
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacies,
    count: 4,
    color: '#007F0E',
    icon: L.icon({
      iconUrl: icons.pharmacy,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }
];
