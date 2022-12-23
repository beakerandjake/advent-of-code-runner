import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({ requiredPartsHaveBeenSolved: jest.fn() }));

// import after mocks set up
const { requiredPartsHaveBeenSolved } = await import('../../src/answers.js');
const { assertPuzzleLevelMet } = await import('../../src/actions/links/assertPuzzleLevelMet.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actions', () => {
  describe('common', () => {
    describe('assertPuzzleIsUnlocked()', () => {
      test('returns true if level met', async () => {
        requiredPartsHaveBeenSolved.mockReturnValue(true);
        const result = await assertPuzzleLevelMet({ year: 2022, day: 1, part: 1 });
        expect(result).toBe(true);
      });

      test('returns false if level not met', async () => {
        requiredPartsHaveBeenSolved.mockReturnValue(false);
        const result = await assertPuzzleLevelMet({ year: 2022, day: 1, part: 1 });
        expect(result).toBe(false);
      });
    });
  });
});
