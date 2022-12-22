import {
  jest, describe, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';
import { getConfigValue as getConfigValueOrig } from '../../src/config.js';
import { actualResponseMainTags, getResponseHtml } from './getActualResponseHtml.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('src/api/parseHtml.js', () => ({
  getElementByTagName: jest.fn(),
  getTextContent: jest.fn(),
}));

// import after mocks
const { getConfigValue } = await import('../../src/config.js');
const { getElementByTagName, getTextContent } = await import('../../src/api/parseHtml.js');
const { extractTextContentOfMain, sanitizeMessage, parseResponseMessage } = await import('../../src/api/parseSubmissionResponse.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('parseSubmissionResponse', () => {
  describe('extractTextContentOfMain()', () => {
    test('throws if <main> is not found', () => {
      getElementByTagName.mockReturnValue(null);
      expect(() => extractTextContentOfMain('SADF')).toThrow();
    });

    test.each([
      null, undefined, '',
    ])('throws if text content <main> is: "%s"', (value) => {
      getElementByTagName.mockReturnValue('<main>hello world</main>');
      getTextContent.mockReturnValue(value);
      expect(() => extractTextContentOfMain('SADF')).toThrow();
    });

    test('returns text content', () => {
      const expected = 'ASDFSADFASDFASDF';
      getElementByTagName.mockReturnValue('<main>hello world</main>');
      getTextContent.mockReturnValue(expected);
      const result = extractTextContentOfMain('SADF');
      expect(result).toBe(expected);
    });
  });

  describe('sanitizeMessage()', () => {
    test('trims message', () => {
      const expected = 'ASDF';
      const input = `\t\t\t\t\t${expected}\r\n\r\n`;
      getConfigValue.mockReturnValue([]);
      const result = sanitizeMessage(input);
      expect(result).toBe(expected);
    });

    test('string sanitizer', () => {
      const sanitizer = { pattern: 'COOL', replace: 'CAT' };
      const input = `${sanitizer.pattern}ASDF${sanitizer.pattern}`;
      const expected = `${sanitizer.replace}ASDF${sanitizer.replace}`;
      getConfigValue.mockReturnValue([sanitizer]);
      const result = sanitizeMessage(input);
      expect(result).toBe(expected);
    });

    test('regex sanitizer', () => {
      const sanitizer = { pattern: /AA\d+=/ig, replace: 'CAT' };
      const input = 'AA12345=ASDFAA585849=';
      const expected = `${sanitizer.replace}ASDF${sanitizer.replace}`;
      getConfigValue.mockReturnValue([sanitizer]);
      const result = sanitizeMessage(input);
      expect(result).toBe(expected);
    });

    test('multiple sanitizers', () => {
      const sanitizers = [
        { pattern: 'DOGS', replace: 'CATS' },
        { pattern: 'APPLES', replace: 'ORANGES' },
        { pattern: /\d+/ig, replace: 'NUMBERS' },
        { pattern: 'GONE', replace: '' },
      ];
      getConfigValue.mockReturnValue(sanitizers);
      const input = 'GONE48484DOGSASDFAPPLES123458585';
      const result = sanitizeMessage(input);
      expect(result).toBe('NUMBERSCATSASDFORANGESNUMBERS');
    });

    // these tests are super brittle, but want some way to test the actual
    // sanitizer values from the actual config.
    describe('actual sanitizers', () => {
      test('wrong answer', () => {
        getConfigValue.mockImplementation((...args) => getConfigValueOrig(...args));
        const input = 'That\'s not the right answer.  If you\'re stuck, make sure you\'re using the full input data; there are also some general tips on the about page, or you can ask for hints on the subreddit.  Because you have guessed incorrectly 12 times on this puzzle, please wait 15 minutes before trying again. (You guessed 12349857.) [Return to Day 1]';
        const expected = 'That\'s not the right answer. Because you have guessed incorrectly 12 times on this puzzle, please wait 15 minutes before trying again.';
        const result = sanitizeMessage(input);
        expect(result).toBe(expected);
      });

      test.todo('correct answer');

      test('bad level', () => {
        getConfigValue.mockImplementation((...args) => getConfigValueOrig(...args));
        const input = 'You don\'t seem to be solving the right level.  Did you already complete it? [Return to Day 2]';
        const expected = 'You don\'t seem to be solving the right level. Did you already complete it?';
        const result = sanitizeMessage(input);
        expect(result).toBe(expected);
      });

      test('too many requests', () => {
        getConfigValue.mockImplementation((...args) => getConfigValueOrig(...args));
        const input = 'You gave an answer too recently; you have to wait after submitting an answer before trying again.  You have 14m 6s left to wait. [Return to Day 1]';
        const expected = 'You gave an answer too recently; you have to wait after submitting an answer before trying again. You have 14m 6s left to wait.';
        const result = sanitizeMessage(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('parseSolutionResponse()', () => {
    test('matches wrong answer', () => {
      const input = 'CATS';
      getConfigValue.mockReturnValue({
        correctSolution: /NOMATCH/,
        incorrectSolution: /CATS/i,
        badLevel: /NOMATCH/,
        tooManyRequests: /NOMATCH/,
      });
      const { correct } = parseResponseMessage(input);
      expect(correct).toBe(false);
    });

    test.todo('matches correct answer');

    test('matches bad level', () => {
      const input = 'CATS';
      getConfigValue.mockReturnValue({
        correctSolution: /NOMATCH/,
        incorrectSolution: /NOMATCH/,
        badLevel: /CATS/i,
        tooManyRequests: /NOMATCH/,
      });
      expect(() => parseResponseMessage(input)).toThrow();
    });

    test('matches too many requests', () => {
      const input = 'CATS';
      getConfigValue.mockReturnValue({
        correctSolution: /NOMATCH/,
        incorrectSolution: /NOMATCH/,
        badLevel: /NOMATCH/,
        tooManyRequests: /CATS/i,
      });
      expect(() => parseResponseMessage(input)).toThrow();
    });
  });
});
