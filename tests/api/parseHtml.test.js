import {
  describe, jest, test, afterEach,
} from '@jest/globals';

import { getTextContent } from '../../src/api/parseHtml';

describe('parseHtml', () => {
  describe('getTextContent()', () => {
    test('handles basic tag', () => {
      const input = '<span>hello world</span>';
      const expected = 'hello world';
      expect(getTextContent(input)).toBe(expected);
    });

    test('handles tag with attributes', () => {
      const input = '<span id="helloWorld" class="cats">hello world</span>';
      const expected = 'hello world';
      expect(getTextContent(input)).toBe(expected);
    });

    test('handles simple nested element', () => {
      const input = `
        <p>
          <span>hello world</span>
        </p>
      `;
      const expected = 'hello world';
      expect(getTextContent(input)).toBe(expected);
    });

    test('handles deeply nested element', () => {
      const input = `
        <p>
          <span>
            <span>
              <span>hello world</span>
            </span>
          </span>
        </p>`;
      const expected = 'hello world';
      expect(getTextContent(input)).toBe(expected);
    });

    test('handles deeply nested element with attributes', () => {
      const input = `
        <p class="cats">
          <span id="anchor1" class="purple">
            <span onClick="myCoolFunction()">
              <span style="color:blue">hello world</span>
            </span>
          </span>
        </p>`;
      const expected = 'hello world';
      expect(getTextContent(input)).toBe(expected);
    });
  });
});
