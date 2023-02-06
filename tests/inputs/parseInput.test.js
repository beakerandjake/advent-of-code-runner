import { describe, test } from '@jest/globals';
import { splitLines } from '../../src/inputs/parseInput.js';

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
      const input = 'ASDFQWERRTY';
      const result = splitLines(input);
      expect(result).toEqual([input]);
    });

    test('returns each line as array element', async () => {
      const lines = ['1234', 'ASDF', 'QWER', '@#$', 'asdf', '', 'zxcgv'];
      const input = lines.join('\n');
      const result = splitLines(input);
      expect(result).toEqual(lines);
    });
  });
});
