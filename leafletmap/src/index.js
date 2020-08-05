import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';

import stops from './stops.json';
import setupMap from './setupMap';
import renderRoutes from './routes';
import stopsPolygon from './stopsPolygon';

const mapInstance = setupMap();

renderRoutes(mapInstance);

stopsPolygon(stops.slice(0, 500), '#093').addTo(mapInstance);
