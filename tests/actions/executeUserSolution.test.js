import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const mockExecuter = jest.fn();
jest.unstable_mockModule('src/solutions/index.js', () => ({ executeUserSolution: mockExecuter }));

// import after mocks set up
const { executeUserSolution } = await import('../../src/actions/links/executeUserSolution.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
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
