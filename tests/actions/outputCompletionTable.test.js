import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
// jest.unstable_mockModule('src/persistence/userDataFile.js', () => ({ getValue: jest.fn() }));
// jest.unstable_mockModule('src/validation/index.js', () => ({ yearIsValid: jest.fn() }));

// import after mocks set up
const { outputCompletionTable } = await import('../../src/actions/links/outputCompletionTable.js');

describe('actions', () => {
  describe('links', () => {
    describe('outputCompletionTable()', () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      test.each([
        null, undefined,
      ])('throws if year is: "%s"', async (year) => {
        await expect(async () => outputCompletionTable({ year })).rejects.toThrow();
      });
    });
  });
});
