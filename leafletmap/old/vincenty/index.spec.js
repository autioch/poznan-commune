/* eslint-env mocha */
const fn = require('./wiki.js');
const { expect } = require('chai');
const testCases = require('./index.testCases');

describe('haversine', () => {
  testCases.forEach(({ x, y, distance }, index) => {
    it(`${index}: calculates valid distance in km for`, () => {
      const result = fn(x, y);

      expect(result).to.deep.equal(distance);
    });
  });
});
