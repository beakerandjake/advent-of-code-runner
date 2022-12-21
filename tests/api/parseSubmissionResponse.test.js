import {
  jest, describe, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';
import { actualResponseMainTags, getResponseHtml } from './getActualResponseHtml.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/api/parseHtml.js', () => ({
  getElementByTagName: jest.fn(),
  getTextContent: jest.fn(),
}));

// import after mocks
const { getElementByTagName, getTextContent } = await import('../../src/api/parseHtml.js');
const { extractTextContentOfMain } = await import('../../src/api/parseSubmissionResponse.js');

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
});
