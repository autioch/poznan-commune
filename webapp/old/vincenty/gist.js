/* eslint-disable max-len, one-var, prefer-const, sort-vars, no-mixed-operators, vars-on-top, no-var, no-inner-declarations, no-plusplus, block-scoped-var */

const RADIUS_EQUATOR = 6378137;
const FLATTENING = 1 / 298.257223563;
const RADIUS_POLES = (1 - FLATTENING) * RADIUS_EQUATOR;
const degToRad = (deg) => deg / 180.0 * Math.PI;

/* !
 * JavaScript function to calculate the geodetic distance between two points specified by latitude/longitude using the Vincenty inverse formula for ellipsoids.
 *
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty.html and optimized / cleaned up by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975 <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 *
 * @param   {Number} lat1, lon1: first point in decimal degrees
 * @param   {Number} lat2, lon2: second point in decimal degrees
 * @returns {Number} distance in metres between points
 */

module.exports = function distVincenty(lat1, lon1, lat2, lon2) {
  let L = degToRad(lon2 - lon1),
      x = Math.atan(1 - FLATTENING),
      U1 = x * Math.tan(degToRad(lat1)),
      U2 = x * Math.tan(degToRad(lat2)),
      sinU1 = Math.sin(U1),
      cosU1 = Math.cos(U1),
      sinU2 = Math.sin(U2),
      cosU2 = Math.cos(U2),
      lambda = L,
      lambdaP,
      iterLimit = 100;

  do {
    var sinLambda = Math.sin(lambda),
        cosLambda = Math.cos(lambda),
        sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));

    if (sinSigma === 0) {
      return 0; // co-incident points
    }
    var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda,
        sigma = Math.atan2(sinSigma, cosSigma),
        sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma,
        cosSqAlpha = 1 - sinAlpha * sinAlpha,
        cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha,
        C = FLATTENING / 16 * cosSqAlpha * (4 + FLATTENING * (4 - 3 * cosSqAlpha));

    if (isNaN(cos2SigmaM)) {
      cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
    }
    lambdaP = lambda;
    lambda = L + (1 - C) * FLATTENING * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    return NaN; // formula failed to converge
  }

  let uSq = cosSqAlpha * (RADIUS_EQUATOR * RADIUS_EQUATOR - RADIUS_POLES * RADIUS_POLES) / (RADIUS_POLES * RADIUS_POLES),
      A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
      B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
      deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM))),
      s = RADIUS_POLES * A * (sigma - deltaSigma);

  return s.toFixed(3); // round to 1mm precision
};
