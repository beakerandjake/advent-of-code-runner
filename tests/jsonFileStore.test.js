import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { DataFileIOError, DataFileParsingError } from '../src/errors/index.js';

// import { getConfigValue } from '../config.js';
// import { logger } from '../logger.js';
// import { loadFileContents, saveFile } from './io.js';

// setup mocks.
jest.unstable_mockModule('../src/persistence/io.js', () => ({
  loadFileContents: jest.fn(),
  saveFile: jest.fn(),
}));

jest.unstable_mockModule('../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

jest.unstable_mockModule('../src/logger.js', () => ({
  logger: {
    silly: jest.fn(),
  },
}));

// jest.unstable_mockModule('../src/persistence/cachedValue.js', () => ({
//   CachedValue: jest.fn(() => ({
//     value: jest.fn(),
//     setValue: jest.fn(),
//     hasValue: jest.fn(),
//   })),
// }));
const mockCache = {
  value: null,
  setValue: jest.fn(),
  hasValue: jest.fn(),
};
jest.unstable_mockModule('../src/persistence/cachedValue.js', () => ({
  CachedValue: jest.fn(() => mockCache),
}));

// import after setting up the mock so the modules import the mocked version
const { CachedValue } = await import('../src/persistence/cachedValue.js');
const { loadFileContents, saveFile } = await import('../src/persistence/io.js');
const { getStoreValue, setStoreValue } = await import('../src/persistence/jsonFileStore.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('jsonFileStore', () => {
  describe('getStoreValue() - cache is empty', () => {
    // mock empty cache for each test in this block.
    beforeEach(() => {
      mockCache.value = null;
      mockCache.hasValue.mockReturnValue(false);
      // empty cache should set set value correctly.
      mockCache.setValue.mockImplementation((x) => {
        mockCache.value = x;
      });
    });

    test('loadFileContents is called', async () => {
      await getStoreValue('1234');
      expect(loadFileContents).toBeCalled();
    });

    test('throws if loadFileContents throws', async () => {
      loadFileContents.mockImplementationOnce(async () => {
        throw new Error('Could not load file!');
      });
      expect(async () => getStoreValue('2134'))
        .rejects
        .toThrow(DataFileIOError);
    });

    test('throws if data file is invalid json', async () => {
      loadFileContents.mockReturnValueOnce('{COOL:1234,}');
      expect(async () => getStoreValue('2134'))
        .rejects
        .toThrow(DataFileParsingError);
    });

    test('returns default value if user data file has no contents', async () => {
      const defaultValue = 45;
      loadFileContents.mockReturnValueOnce('');
      expect(await getStoreValue('1234', defaultValue)).toEqual(defaultValue);
    });

    test('returns default value if key not found', async () => {
      const defaultValue = 45;
      loadFileContents.mockReturnValueOnce(JSON.stringify({ one: 1, two: 2, three: 3 }));
      expect(await getStoreValue('four', defaultValue)).toEqual(defaultValue);
    });

    test('returns value if key found', async () => {
      const expected = 4;
      const key = 'four';
      loadFileContents.mockReturnValueOnce(
        JSON.stringify({ one: 1, [key]: expected }),
      );
      expect(await getStoreValue(key, 66)).toEqual(expected);
    });

    // test('noop on puzzle not found', async () => {
    //   findPuzzle.mockReturnValueOnce(null);
    //   await tryToSetFastestExecutionTime(2022, 1, 1, 12341234);
    //   expect(addOrEditPuzzle).not.toBeCalled();
    // });
  });

  describe('setStoreValue()', () => {
    test.todo('todo');
  });
});
