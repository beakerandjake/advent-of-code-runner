import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
const mockExecuter = jest.fn();
jest.unstable_mockModule('src/solutions/index.js', () => ({ execute: mockExecuter }));

// import after mocks set up
const { executeUserSolution } = await import('../../src/actions/executeUserSolution.js');

describe('executeUserSolution()', () => {
  afterEach(() => {
    jest.useFakeTimers();
    jest.resetAllMocks();
  });

  test.each([
    null, undefined,
  ])('throws if question is %s', async (question) => {
    await expect(async () => executeUserSolution(question)).rejects.toThrow();
  });

  test('returns results', async () => {
    const args = { day: 1, level: 1, input: 'ASDF' };
    const executionResult = { answer: '1234', executionTimeNs: 1234 };
    mockExecuter.mockResolvedValue(executionResult);
    const result = await executeUserSolution(args);
    expect(result).toEqual(executionResult);
  });
});
