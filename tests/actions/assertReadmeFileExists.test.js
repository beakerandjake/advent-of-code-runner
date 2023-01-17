import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('fs-extra/esm', () => ({ pathExists: jest.fn() }));

// import after mocks set up
const { pathExists } = await import('fs-extra/esm');
const { assertReadmeExists } = await import('../../src/actions/assertReadmeExists.js');

describe('assertReadmeExists()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns false if readme does not exist', async () => {
    pathExists.mockResolvedValue(false);
    const result = await assertReadmeExists();
    expect(result).toBe(false);
  });

  test('returns true if readme does exists', async () => {
    pathExists.mockResolvedValue(true);
    const result = await assertReadmeExists();
    expect(result).toBe(true);
  });
});
