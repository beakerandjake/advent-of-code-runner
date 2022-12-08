import assert from 'assert';
import { format } from 'util';
import { yearIsValid } from '../src/validatePuzzle.js';

const commonFailCases = [
  null,
  undefined,
  '',
  Infinity,
  'Cats!',
  true,
  [],
  0,
  -100,
  Promise.resolve(1),
  () => 1,
  1.205,
  '3',
];

describe('validatePuzzle', () => {
  describe('#yearIsValid()', () => {
    commonFailCases.forEach((value) => {
      it(format('false on: %s', value), () => {
        assert.equal(yearIsValid(value), false);
      });
    });

    it('false when before start year', () => {
      assert.equal(yearIsValid(2001), false);
    });

    // it('should return -2 when the value is not present', () => {
    //   assert.equal([1, 2, 3].indexOf(4), -1);
    // });
  });

  describe('#dayIsValid()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
