import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger, mockConfig } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('src/api/parseSubmissionResponse.js', () => ({
  extractTextContentOfMain: jest.fn(),
  sanitizeMessage: jest.fn(),
  parseResponseMessage: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// import after mocks are setup
const { extractTextContentOfMain, sanitizeMessage, parseResponseMessage } = await import('../../src/api/parseSubmissionResponse.js');
const { downloadInput, submitSolution } = await import('../../src/api/api.js');

beforeEach(() => {
  jest.resetAllMocks();
  mockFetch.mockReset();
});

describe('api', () => {
  describe('downloadInput()', () => {
    test.each([
      undefined, null, '',
    ])('throws if authentication token is: "%s"', async (value) => {
      await expect(async () => downloadInput(2022, 1, value)).rejects.toThrow(/authentication/i);
    });

    test('throws on 400', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        status: 400,
        statusText: 'you no logged in pal',
      }));
      await expect(async () => downloadInput(2022, 1, 'ASDF')).rejects.toThrow(/authentication/i);
    });

    test('throws on 404', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        status: 404,
        statusText: 'da puzzle is not found pal',
      }));
      await expect(async () => downloadInput(2022, 1, 'ASDF')).rejects.toThrow(/found/i);
    });

    test('throws on response not ok', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: false,
        status: 503,
        statusText: 'da gateway is bad pal',
      }));
      await expect(async () => downloadInput(2022, 1, 'ASDF')).rejects.toThrow(/unexpected/i);
    });

    test.each([
      undefined, null, '', '\t',
    ])('throws on empty input: "%s"', async (value) => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(value),
      }));
      await expect(async () => downloadInput(2022, 1, 'ASDF')).rejects.toThrow(/empty/i);
    });

    test('returns input on success', async () => {
      const expected = '1234\n5678\n9101112';
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(expected),
      }));
      const result = await downloadInput(2022, 1, 'ASDF');
      expect(result).toBe(expected);
    });
  });

  describe('submitSolution', () => {
    test.each([
      undefined, null, '',
    ])('throws if authentication token is: "%s"', async (value) => {
      await expect(async () => submitSolution(2022, 1, 1, 'ASDF', value)).rejects.toThrow(/authentication/i);
    });

    test.each([
      400, 302,
    ])('throws on auth failed with: %s', async (status) => {
      mockFetch.mockImplementation(() => Promise.resolve({
        status,
        statusText: 'you no logged in pal',
      }));
      await expect(async () => submitSolution(2022, 1, 1, 'solution', 'auth')).rejects.toThrow(/authentication/i);
    });

    test.each([
      400, 302,
    ])('throws on auth failed with: %s', async (status) => {
      mockFetch.mockImplementation(() => Promise.resolve({
        status,
        statusText: 'you no logged in pal',
      }));
      await expect(async () => submitSolution(2022, 1, 1, 'solution', 'auth')).rejects.toThrow(/authentication/i);
    });

    test('throws on response not ok', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: false,
        status: 503,
        statusText: 'da gateway is bad pal',
      }));
      await expect(async () => submitSolution(2022, 1, 1, 'solution', 'auth')).rejects.toThrow(/unexpected/i);
    });

    test.each([
      null, undefined, '',
    ])('throws on empty response text: %s', async (value) => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(value),
      }));
      await expect(async () => submitSolution(2022, 1, 1, 'solution', 'auth')).rejects.toThrow(/response/i);
    });

    test('returns input on success', async () => {
      const expected = { success: true, message: 'ASDF' };
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('some response'),
      }));
      sanitizeMessage.mockReturnValue('not empty');
      parseResponseMessage.mockReturnValue(expected);

      const result = await submitSolution(2022, 1, 1, 'solution', 'auth');
      expect(result).toBe(expected);
    });
  });
});
