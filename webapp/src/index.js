import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet';
import 'leaflet-canvas-marker';
import 'leaflet-groupedlayercontrol';

import currentLocation from './currentLocation';
import settings from './settings';
import setupMap from './setupMap';

// import overlays from './overlays';

const mapInstance = setupMap();

settings(mapInstance);
currentLocation(mapInstance);
