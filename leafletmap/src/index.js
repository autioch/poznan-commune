import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';

import renderRanges from './renderRanges';

import renderStopCircles from './renderStopCircles';

// import renderStopMarkers from './renderStopMarkers';
import renderRouteLines from './renderRouteLines';

const mapInstance = setupMap();

renderRanges(mapInstance);

renderStopCircles(mapInstance);
renderRouteLines(mapInstance);

// renderStopMarkers(mapInstance);
