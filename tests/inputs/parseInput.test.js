import { describe, test } from '@jest/globals';
import { splitLines } from '../../src/inputs/parseInput.js';

const addEndingLineBreak = (input) => `${input}\n`;
const inputStringFromArray = (lines) => addEndingLineBreak(lines.join('\n'));

describe('parseInput', () => {
  describe('splitLines()', () => {
    test.each([null, undefined])('returns [] if input is "%s"', (input) => {
      const result = splitLines(input);
      expect(result).toEqual([]);
    });

    test.each([1234, () => {}, Promise.resolve(), { value: 1234 }, false])(
      'throws if input is not string (%s)',
      (input) => {
        expect(() => splitLines(input)).toThrow(TypeError);
      }
    );

    test('returns array with one element if no line breaks', async () => {
      const expected = ['ASDFQWERRTY'];
      const result = splitLines(inputStringFromArray(expected));
      expect(result).toEqual(expected);
    });

    test('returns each line as array element', async () => {
      const expected = ['1234', 'ASDF', 'QWER', '@#$', 'asdf', '', 'zxcgv'];
      const result = splitLines(inputStringFromArray(expected));
      expect(result).toEqual(expected);
    });

    // test('does not include empty ');
  });
});
