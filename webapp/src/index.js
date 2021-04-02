import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet';
import 'leaflet-canvas-marker';
import 'leaflet-groupedlayercontrol';

// import overlays from './overlays';
import settings from './settings';
import setupMap from './setupMap';

const mapInstance = setupMap();

settings(mapInstance);
