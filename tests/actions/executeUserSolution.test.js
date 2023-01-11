import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
const mockExecuter = jest.fn();
jest.unstable_mockModule('src/solutions/index.js', () => ({ execute: mockExecuter }));

// import after mocks set up
const { executeUserSolution } = await import('../../src/actions/executeUserSolution.js');

describe('actions', () => {
  describe('links', () => {
    afterEach(() => {
      jest.useFakeTimers();
      jest.resetAllMocks();
    });

    describe('executeUserSolution()', () => {
      test('returns results', async () => {
        const args = { day: 1, part: 1, input: 'ASDF' };
        const executionResult = { answer: '1234', executionTimeNs: 1234 };
        mockExecuter.mockResolvedValue(executionResult);
        const result = await executeUserSolution(args);
        expect(result).toEqual(executionResult);
      });
    });
  });
});
