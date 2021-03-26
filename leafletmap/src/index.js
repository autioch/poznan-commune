import './styles';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import setupMap from './setupMap';
import 'leaflet';
import 'leaflet-groupedlayercontrol';

import overlays from './overlays';

const mapInstance = setupMap();

// L.control.layers({}, {
//   ...overlays.rangesOverlays(),
//   ...overlays.routeLinesOverlays(),
//   ...overlays.stopCirclesOverlays()
// }).addTo(mapInstance);

// L.control.layers(overlays.rangesOverlays()).addTo(mapInstance);
// L.control.layers(overlays.routeLinesOverlays()).addTo(mapInstance);
// L.control.layers(overlays.stopCirclesOverlays()).addTo(mapInstance);

overlays(mapInstance);
