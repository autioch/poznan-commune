import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';
import renderRoutes from './routes';

import renderStopCircles from './renderStopCircles';

// import renderStopMarkers from './renderStopMarkers';

// import stopsPolygon from './stopsPolygon';

const mapInstance = setupMap();

renderRoutes(mapInstance);

// renderStopMarkers(mapInstance);

renderStopCircles(mapInstance);

// stopsPolygon(stops, '#093').addTo(mapInstance);

console.log(mapInstance.getZoom());
