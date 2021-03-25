import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';

import renderRanges from './renderRanges';
import renderStopCircles from './renderStopCircles';
import renderRouteLines from './renderRouteLines';

// import renderStopMarkers from './renderStopMarkers';

const mapInstance = setupMap();

renderRanges(mapInstance);

renderStopCircles(mapInstance);
renderRouteLines(mapInstance);

// renderStopMarkers(mapInstance);
