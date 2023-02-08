import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
const logger = mockLogger();
const { getConfigValue } = mockConfig();
const mockExecuter = jest.fn();
jest.unstable_mockModule('src/solutions/index.js', () => ({ execute: mockExecuter }));

// import after mocks set up
const { executeUserSolution } = await import('../../src/actions/executeUserSolution.js');

describe('executeUserSolution()', () => {
  afterEach(() => {
    jest.useFakeTimers();
    jest.resetAllMocks();
  });

  test.each([null, undefined])('throws if question is %s', async (question) => {
    await expect(async () => executeUserSolution(question)).rejects.toThrow();
  });

  test('returns results', async () => {
    const args = { day: 1, level: 1, input: 'ASDF' };
    const expected = { answer: '1234', runtimeNs: 1234 };
    mockExecuter.mockResolvedValue(expected);
    const result = await executeUserSolution(args);
    expect(result).toEqual({ answer: expected.answer, runtimeNs: expected.runtimeNs });
  });

  test('logs cancel message after delay', async () => {
    jest.useRealTimers();
    getConfigValue.mockImplementation((key) => {
      if (key === 'solutionRunner.cancelMessageDelayMs') {
        return 150;
      }
      throw new Error('unknown key value');
    });
    mockExecuter.mockImplementation(
      async () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ answer: '1234', runtimeNs: 1234 }), 400);
        })
    );
    await executeUserSolution({ day: 1, level: 1, input: 'ASDF' });
    // brittle test case, will fail if logging message order changes..
    expect(logger.festive).toHaveBeenNthCalledWith(2, expect.stringContaining('Ctrl+C'));
  });
});
