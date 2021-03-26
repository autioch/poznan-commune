import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';
import 'leaflet';
import 'leaflet-groupedlayercontrol';

import overlays from './overlays';
import events from './events';

const mapInstance = setupMap();

overlays(mapInstance);
events(mapInstance);
