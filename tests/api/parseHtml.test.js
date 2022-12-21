import {
  describe, jest, test, afterEach,
} from '@jest/globals';

import { getElementByTagName, getTextContent } from '../../src/api/parseHtml.js';

describe('parseHtml', () => {
  describe('getElementByTagName()', () => {
    test.each([
      { value: null, title: 'null' },
      { value: undefined, title: 'undefined' },
      { value: '', title: '\'\'' },
      { value: '\t', title: 'whitespace character' },
      { value: '\r\n', title: 'new line character' },
      { value: '\t\t\t', title: 'multiple whitespace characters' },
    ])('returns null with empty html value ($title)', ({ value }) => {
      const result = getElementByTagName(value, 'p');
      expect(result).toBeNull();
    });

    test.each([
      null, undefined, '',
    ])('returns null with empty tag (%s)', (value) => {
      const result = getElementByTagName('<p>Hello World</p>', value);
      expect(result).toBeNull();
    });

    test('returns null if no tags in html', () => {
      const result = getElementByTagName('Hello World I have no Tags!', 'span');
      expect(result).toBeNull();
    });

    test('returns null if tag not found', () => {
      const html = `
      <div>
        <div>
          <span class="cats">Cool Html!</span>
          </br>
        </div>
      </div>
      `;
      const result = getElementByTagName(html, 'img');
      expect(result).toBeNull();
    });

    test.each([
      ['html', '<!DOCTYPE html><html><body>Hello!</body></html>', '<html><body>Hello!</body></html>'],
      ['main', '<!DOCTYPE html><html><body><main>Hello!</main></body></html>', '<main>Hello!</main>'],
      ['body', '<!DOCTYPE html><html><body>Hello!</body></html>', '<body>Hello!</body>'],
      ['h1', '<!DOCTYPE html><html><body><h1 class="cats">My First Heading</h1></body></html>', '<h1 class="cats">My First Heading</h1>'],
      ['p', '<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>', '<p>My first paragraph.</p>'],
    ])('finds tag <%s> when exists', (tag, html, expected) => {
      const result = getElementByTagName(html, tag);
      expect(result).toBe(expected);
    });
  });

  describe('getTextContent()', () => {
    test.each([
      { value: null, title: 'null' },
      { value: undefined, title: 'undefined' },
      { value: '', title: '\'\'' },
    ])('returns empty string with empty html value ($title)', ({ html }) => {
      const result = getTextContent(html);
      expect(result).toBe('');
    });

    test('pass through if no tags present', () => {
      const expected = 'definitely no tags here!';
      const result = getTextContent(expected);
      expect(result).toBe(expected);
    });

    test.each([
      ['hello', '<p>hello</p>'],
      ['hello', '<span>hello</span>'],
      ['hello', '<div>hello</div>'],
      ['hello', '<body>hello</body>'],
      ['hello', '<div><span>hello</span></div>'],
      ['hello', '<div class="cats">hello</div>'],
      ['hello', '<div class="cats"><p>hello</p></div>'],
      ['hello world', '<div class="cats">hello <a href="https://www.wikipedia.org">world</a></div>'],
    ])('returns: %s from: %s', (expected, html) => {
      const result = getTextContent(html);
      expect(result).toBe(expected);
    });
    //   test('handles basic tag', () => {
    //     const input = '<span>hello world</span>';
    //     const expected = 'hello world';
    //     expect(getTextContent(input)).toBe(expected);
    //   });

    //   test('handles tag with attributes', () => {
    //     const input = '<span id="helloWorld" class="cats">hello world</span>';
    //     const expected = 'hello world';
    //     expect(getTextContent(input)).toBe(expected);
    //   });

    //   test('handles simple nested element', () => {
    //     const input = `
    //       <p>
    //         <span>hello world</span>
    //       </p>
    //     `;
    //     const expected = 'hello world';
    //     expect(getTextContent(input)).toBe(expected);
    //   });

    //   test('handles deeply nested element', () => {
    //     const input = `
    //       <p>
    //         <span>
    //           <span>
    //             <span>hello world</span>
    //           </span>
    //         </span>
    //       </p>`;
    //     const expected = 'hello world';
    //     expect(getTextContent(input)).toBe(expected);
    //   });

  //   test('handles deeply nested element with attributes', () => {
  //     const input = `
  //       <p class="cats">
  //         <span id="anchor1" class="purple">
  //           <span onClick="myCoolFunction()">
  //             <span style="color:blue">hello world</span>
  //           </span>
  //         </span>
  //       </p>`;
  //     const expected = 'hello world';
  //     expect(getTextContent(input)).toBe(expected);
  //   });
  });
});
