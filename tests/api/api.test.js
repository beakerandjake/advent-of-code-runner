import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockLogger, mockConfig, easyMock } from '../mocks.js';
import {
  EmptyResponseError,
  InternalServerError,
  NotAuthorizedError,
  PuzzleNotFoundError,
} from '../../src/errors/apiErrors.js';

// setup mocks
easyMock([
  ['src/formatting.js', ['sizeOfStringInKb']],
  ['src/api/urls.js', ['puzzleAnswerUrl', 'puzzleInputUrl']],
]);
mockLogger();
mockConfig();

const mockFetch = jest.fn();
global.fetch = mockFetch;

// import after mocks are setup
const { getInput, postAnswer } = await import('../../src/api/api.js');

beforeEach(() => {
  jest.resetAllMocks();
  mockFetch.mockReset();
});

describe('api', () => {
  describe('getInput()', () => {
    test.each([undefined, null, ''])(
      'throws if authentication token is: "%s"',
      async (value) => {
        await expect(async () => getInput(2022, 1, value)).rejects.toThrow(
          NotAuthorizedError
        );
      }
    );

    test('throws on 400', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          status: 400,
          statusText: 'you no logged in pal',
        })
      );
      await expect(async () => getInput(2022, 1, 'ASDF')).rejects.toThrow(
        NotAuthorizedError
      );
    });

    test('throws on 404', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          status: 404,
          statusText: 'da puzzle is not found pal',
        })
      );
      await expect(async () => getInput(2022, 1, 'ASDF')).rejects.toThrow(
        PuzzleNotFoundError
      );
    });

    test('throws on response not ok', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          statusText: 'da gateway is bad pal',
        })
      );
      await expect(async () => getInput(2022, 1, 'ASDF')).rejects.toThrow(
        InternalServerError
      );
    });

    test.each([undefined, null, ''])(
      'throws on empty input returned: "%s"',
      async (value) => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(value),
          })
        );
        await expect(async () => getInput(2022, 1, 'ASDF')).rejects.toThrow(
          EmptyResponseError
        );
      }
    );

    test('returns input on success', async () => {
      const expected = '1234\n5678\n9101112';
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(expected),
        })
      );
      const result = await getInput(2022, 1, 'ASDF');
      expect(result).toBe(expected);
    });

    test('does not trim start of input', async () => {
      const expected = '\t1234\n5678\n9101112';
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(expected),
        })
      );
      const result = await getInput(2022, 1, 'ASDF');
      expect(result).toBe(expected);
    });

    test('does not trim end of input', async () => {
      const expected = '1234\n5678\n9101112\n';
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(expected),
        })
      );
      const result = await getInput(2022, 1, 'ASDF');
      expect(result).toBe(expected);
    });
  });

  describe('postAnswer()', () => {
    test.each([undefined, null, ''])(
      'throws if authentication token is: "%s"',
      async (value) => {
        await expect(async () =>
          postAnswer(2022, 1, 1, 'ASDF', value)
        ).rejects.toThrow(NotAuthorizedError);
      }
    );

    test.each([400, 302])('throws on auth failed with: %s', async (status) => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          status,
          statusText: 'you no logged in pal',
        })
      );
      await expect(async () =>
        postAnswer(2022, 1, 1, 'solution', 'auth')
      ).rejects.toThrow(NotAuthorizedError);
    });

    test('throws on 404', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'not found pal',
        })
      );
      await expect(async () =>
        postAnswer(2022, 1, 1, 'solution', 'auth')
      ).rejects.toThrow(PuzzleNotFoundError);
    });

    test('throws on response not ok', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          statusText: 'da gateway is bad pal',
        })
      );
      await expect(async () =>
        postAnswer(2022, 1, 1, 'solution', 'auth')
      ).rejects.toThrow(InternalServerError);
    });

    test.each([null, undefined, ''])(
      'throws on empty response text: %s',
      async (value) => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(value),
          })
        );
        await expect(async () =>
          postAnswer(2022, 1, 1, 'solution', 'auth')
        ).rejects.toThrow(EmptyResponseError);
      }
    );

    test('returns input on success', async () => {
      const expected = 'One cool response!';
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(expected),
        })
      );
      const result = await postAnswer(2022, 1, 1, 'solution', 'auth');
      expect(result).toBe(expected);
    });
  });
});
