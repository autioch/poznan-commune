import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';

import renderRanges from './renderRanges';

// import renderRouteLines from './renderRouteLines';
// import renderStopCircles from './renderStopCircles';
// import renderStopMarkers from './renderStopMarkers';

const mapInstance = setupMap();

// renderStopMarkers(mapInstance);
// renderStopCircles(mapInstance);
// renderRouteLines(mapInstance);
renderRanges(mapInstance);
