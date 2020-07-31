import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';

import L from 'leaflet';
import stops from './stops.json';
import setupMap from './setupMap';
import renderRoutes from './routes';

const mapInstance = setupMap();

/*
{
  "stop_id": "2",
  "stop_code": "SOB42",
  "stop_name": "Os. Sobieskiego",
  "stop_lat": "52.4638000300",
  "stop_lon": "16.9166601800",
  "zone_id": "A"
}
 */

renderRoutes(mapInstance);

stops.forEach((stopItem) => {
  L.circle([stopItem.stop_lat, stopItem.stop_lon], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 10
  }).addTo(mapInstance);
});
