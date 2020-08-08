import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';

import renderStopCircles from './renderStopCircles';

// import renderStopMarkers from './renderStopMarkers';

const mapInstance = setupMap();

// renderStopMarkers(mapInstance);

renderStopCircles(mapInstance);
