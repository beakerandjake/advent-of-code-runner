import { describe, test } from '@jest/globals';

import { getElementByTagName, getTextContent } from '../../src/api/parseHtml.js';
import {
  badLevel,
  correctAnswerDayComplete,
  wrongAnswer,
  tooManyRequests,
  correctAnswerDayIncomplete,
} from './getActualResponseHtml.js';

describe('parseHtml', () => {
  describe('getElementByTagName()', () => {
    test.each([
      { value: null, title: 'null' },
      { value: undefined, title: 'undefined' },
      { value: '', title: "''" },
      { value: '\t', title: 'whitespace character' },
      { value: '\r\n', title: 'new line character' },
      { value: '\t\t\t', title: 'multiple whitespace characters' },
    ])('returns null with empty html value ($title)', ({ value }) => {
      const result = getElementByTagName(value, 'p');
      expect(result).toBeNull();
    });

    test.each([null, undefined, ''])('returns null with empty tag (%s)', (value) => {
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
      [
        'html',
        '<!DOCTYPE html><html><body>Hello!</body></html>',
        '<html><body>Hello!</body></html>',
      ],
      [
        'main',
        '<!DOCTYPE html><html><body><main>Hello!</main></body></html>',
        '<main>Hello!</main>',
      ],
      ['body', '<!DOCTYPE html><html><body>Hello!</body></html>', '<body>Hello!</body>'],
      [
        'h1',
        '<!DOCTYPE html><html><body><h1 class="cats">My First Heading</h1></body></html>',
        '<h1 class="cats">My First Heading</h1>',
      ],
      [
        'p',
        '<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>',
        '<p>My first paragraph.</p>',
      ],
    ])('finds tag <%s> when exists', (tag, html, expected) => {
      const result = getElementByTagName(html, tag);
      expect(result).toBe(expected);
    });

    describe('actual advent of code responses', () => {
      test('wrong answer', () => {
        const result = getElementByTagName(wrongAnswer.html, 'main');
        expect(result).toBe(wrongAnswer.mainTag);
      });

      test('bad level', () => {
        const result = getElementByTagName(badLevel.html, 'main');
        expect(result).toBe(badLevel.mainTag);
      });

      test('correct answer (day complete)', () => {
        const result = getElementByTagName(correctAnswerDayComplete.html, 'main');
        expect(result).toBe(correctAnswerDayComplete.mainTag);
      });

      test('correct answer (day incomplete)', () => {
        const result = getElementByTagName(correctAnswerDayIncomplete.html, 'main');
        expect(result).toBe(correctAnswerDayIncomplete.mainTag);
      });

      test('too many requests', () => {
        const result = getElementByTagName(tooManyRequests.html, 'main');
        expect(result).toBe(tooManyRequests.mainTag);
      });
    });
  });

  describe('getTextContent()', () => {
    test.each([
      { value: null, title: 'null' },
      { value: undefined, title: 'undefined' },
      { value: '', title: "''" },
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
      [
        'hello world',
        '<div class="cats">hello <a href="https://www.wikipedia.org">world</a></div>',
      ],
    ])('returns: %s from: %s', (expected, html) => {
      const result = getTextContent(html);
      expect(result).toBe(expected);
    });

    describe('actual advent of code responses', () => {
      test('wrong answer', () => {
        // eslint-disable-next-line quotes
        const expected = `That's not the right answer. If you're stuck, make sure you're using the full input data; there are also some general tips on the about page, or you can ask for hints on the subreddit. Please wait one minute before trying again. (You guessed ASDF.) [Return to Day 2]`;
        const result = getTextContent(wrongAnswer.mainTag);
        expect(result).toBe(expected);
      });

      test('correct answer (day complete)', () => {
        // eslint-disable-next-line quotes
        const expected = `That's the right answer! You are one gold star closer to collecting enough star fruit. You have completed Day 1! You can [Shareon Twitter Mastodon] this victory or [Return to Your Advent Calendar].`;
        const result = getTextContent(correctAnswerDayComplete.mainTag);
        expect(result).toBe(expected);
      });

      test('correct answer (day incomplete)', () => {
        // eslint-disable-next-line quotes
        const expected = `That's the right answer! You are one gold star closer to collecting enough star fruit. [Continue to Part Two]`;
        const result = getTextContent(correctAnswerDayIncomplete.mainTag);
        expect(result).toBe(expected);
      });

      test('bad level', () => {
        const expected =
          "You don't seem to be solving the right level. Did you already complete it? [Return to Day 1]";
        const result = getTextContent(badLevel.mainTag);
        expect(result).toBe(expected);
      });

      test('too many requests', () => {
        const expected =
          'You gave an answer too recently; you have to wait after submitting an answer before trying again. You have 14m 6s left to wait. [Return to Day 1]';
        const result = getTextContent(tooManyRequests.mainTag);
        expect(result).toBe(expected);
      });
    });
  });
});
