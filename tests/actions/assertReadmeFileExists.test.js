import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({ readmeExists: jest.fn() }));

// import after mocks set up
const { readmeExists } = await import('../../src/validation/userFilesExist.js');
const { assertReadmeExists } = await import('../../src/actions/assertReadmeExists.js');

describe('assertReadmeExists()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns false if readme does not exist', async () => {
    readmeExists.mockResolvedValue(false);
    const result = await assertReadmeExists();
    expect(result).toBe(false);
  });

  test('returns true if readme does exists', async () => {
    readmeExists.mockResolvedValue(true);
    const result = await assertReadmeExists();
    expect(result).toBe(true);
  });
});
