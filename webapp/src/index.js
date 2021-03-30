import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet';
import 'leaflet-groupedlayercontrol';

import overlays from './overlays';
import setupMap from './setupMap';

const mapInstance = setupMap();

overlays(mapInstance);
