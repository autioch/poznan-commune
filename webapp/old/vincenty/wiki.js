/* eslint-disable no-mixed-operators, max-statements, no-plusplus, max-len */
const a = 6378137; // radius equator
const f = 1 / 298.257223563;
const ACCURACY = 0.000000001;// calculate milimeters?
const b = (1 - f) * a; // radius poles
const sqrt = Math.sqrt.bind(Math);
const sqr = (x) => x * x;
const sin = Math.sin.bind(Math);
const cos = Math.cos.bind(Math);
const arctan2 = Math.atan2.bind(Math);
const d2r = (deg) => deg / 180.0 * Math.PI;

/**
 * Calculates distance between two points on earth.
 * @param  {Array} L1 Point 1
 * @param  {Array} L2 Point 2
 * @return {Number}    Distance in meters (with milimeter precision) between the points.
 */
module.exports = function distance([Φ1, L1], [Φ2, L2]) {
  const U1 = Math.atan((1 - f) * Math.tan(d2r(Φ1)));
  const U2 = Math.atan((1 - f) * Math.tan(d2r(Φ2)));
  const L = d2r(L2 - L1);

  let loopLimit = 1000;
  let λ = L; // Difference in longitude of the points on the auxiliary sphere;
  let λPrev = λ;
  let σ; // angular separation between points
  let cos2α;
  let sinσ;
  let cosσ;
  let cos2σm;

  do { // eslint-disable-line no-constant-condition
    loopLimit--;
    sinσ = sqrt(sqr(cos(U2) * sin(λ)) + sqr(cos(U1) * sin(U2) - sin(U1) * cos(U2) * cos(λ)));
    cosσ = sin(U1) * sin(U2) + cos(U1) * cos(U2) * cos(λ);

    if (sinσ === 0) {
      return 0;
    }

    const sinα = (cos(U1) * cos(U2) * sin(λ)) / sinσ;

    σ = arctan2(sinσ, cosσ);
    cos2α = 1 - sqr(sinα);
    cos2σm = cosσ - ((2 * sin(U1) * sin(U2)) / cos2α);

    const C = (f / 16) * cos2α * (4 + f * (4 - 3 * cos2α));

    λPrev = λ;
    λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * sqr(cos2σm))));
  } while (loopLimit > 0 && Math.abs(λ - λPrev) > ACCURACY);

  if (loopLimit === 0) {
    // return NaN;
  }

  const u2 = cos2α * ((sqr(a) - sqr(b)) / sqr(b));
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const Δσ = B * sinσ * (cos2σm + 1 / 4 * B * (cosσ * (-1 + 2 * sqr(cos2σm)) - (B / 6) * cos2σm * (-3 + 4 * sqr(sinσ)) * (-3 + 4 * sqr(cos2σm))));

  return parseFloat((b * A * (σ - Δσ)).toFixed(3)); // meters, 3 digits for cm and mm
};
