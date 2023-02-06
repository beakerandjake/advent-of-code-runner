import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({
  dataFileExists: jest.fn(),
}));

// import after mocks set up
const { dataFileExists } = await import('../../src/validation/userFilesExist.js');
const { assertInitialized } = await import('../../src/actions/assertInitialized.js');

describe('assertInitialized()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns true if data store file exists', async () => {
    dataFileExists.mockResolvedValue(true);
    const result = await assertInitialized();
    expect(result).toBe(true);
  });

  test('returns false if data store file does not exist', async () => {
    dataFileExists.mockResolvedValue(false);
    const result = await assertInitialized();
    expect(result).toBe(false);
  });
});
