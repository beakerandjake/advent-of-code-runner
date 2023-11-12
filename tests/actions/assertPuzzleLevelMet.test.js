import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/answers.js', () => ({
  requiredLevelsHaveBeenSolved: jest.fn(),
}));

// import after mocks set up
const { requiredLevelsHaveBeenSolved } = await import('../../src/answers.js');
const { assertPuzzleLevelMet } = await import(
  '../../src/actions/assertPuzzleLevelMet.js'
);

describe('assertPuzzleLevelMet()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns true if level met', async () => {
    requiredLevelsHaveBeenSolved.mockReturnValue(true);
    const result = await assertPuzzleLevelMet({ year: 2022, day: 1, level: 1 });
    expect(result).toBe(true);
  });

  test('returns false if level not met', async () => {
    requiredLevelsHaveBeenSolved.mockReturnValue(false);
    const result = await assertPuzzleLevelMet({ year: 2022, day: 1, level: 1 });
    expect(result).toBe(false);
  });
});
