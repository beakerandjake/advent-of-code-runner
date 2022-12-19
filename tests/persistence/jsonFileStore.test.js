import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { DataFileIOError, DataFileParsingError } from '../../src/errors/index.js';

// setup mocks.
jest.unstable_mockModule('../../src/persistence/io.js', () => ({
  loadFileContents: jest.fn(),
  saveFile: jest.fn(),
}));

jest.unstable_mockModule('../../src/config.js', () => ({
  getConfigValue: jest.fn(),
}));

jest.unstable_mockModule('../../src/logger.js', () => ({
  logger: {
    silly: jest.fn(),
  },
}));

const mockCache = {
  value: null,
  setValue: jest.fn(),
  hasValue: jest.fn(),
};
jest.unstable_mockModule('../../src/persistence/cachedValue.js', () => ({
  CachedValue: jest.fn(() => mockCache),
}));

// import after setting up the mock so the modules import the mocked version
// const { CachedValue } = await import('../src/persistence/cachedValue.js');
const { loadFileContents, saveFile } = await import('../../src/persistence/io.js');
const { getStoreValue, setStoreValue } = await import('../../src/persistence/jsonFileStore.js');

describe('jsonFileStore', () => {
  describe('getStoreValue()', () => {
    describe('cache is empty', () => {
      // mock empty cache for each test in this block.
      beforeEach(() => {
        mockCache.value = null;
        mockCache.hasValue.mockReturnValue(false);
        // empty cache should set set value correctly.
        mockCache.setValue.mockImplementation((x) => {
          mockCache.value = x;
        });
      });

      afterEach(() => {
        expect(loadFileContents).toHaveBeenCalled();
        jest.clearAllMocks();
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

      test('returns undefined if key not found and no default provided', async () => {
        loadFileContents.mockReturnValueOnce(JSON.stringify({ one: 1, two: 2, three: 3 }));
        expect(await getStoreValue('four')).toEqual(undefined);
      });

      test('returns value if key found', async () => {
        const expected = 4;
        const key = 'four';
        loadFileContents.mockReturnValueOnce(
          JSON.stringify({ one: 1, [key]: expected }),
        );
        expect(await getStoreValue(key, 66)).toEqual(expected);
      });
    });

    describe('cache is not empty', () => {
      // mock cache having been set for this whole block.
      beforeEach(() => {
        mockCache.value = {};
        mockCache.hasValue.mockReturnValue(true);
        // empty cache should set set value correctly.
        mockCache.setValue.mockImplementation((x) => {
          mockCache.value = x;
        });
      });

      afterEach(() => {
        expect(loadFileContents).not.toHaveBeenCalled();
        jest.clearAllMocks();
      });

      test('returns value if key found', async () => {
        const key = 'test';
        const value = 'ASDF';
        mockCache.value = { [key]: value };
        expect(await getStoreValue(key)).toBe(value);
      });

      test('returns default value if key not found', async () => {
        const expected = 'default';
        mockCache.value = { 'not key': '1234' };
        expect(await getStoreValue('key', 'default')).toBe(expected);
      });

      test('returns undefined if key not found and no default provided', async () => {
        mockCache.value = { 'not key': '1234' };
        expect(await getStoreValue('key')).toBe(undefined);
      });
    });
  });

  describe('setStoreValue()', () => {
    describe('cache is empty', () => {
      // mock empty cache for each test in this block.
      beforeEach(() => {
        mockCache.value = null;
        mockCache.hasValue.mockReturnValue(false);
        // empty cache should set set value correctly.
        mockCache.setValue.mockImplementation((x) => {
          mockCache.value = x;
        });
      });

      afterEach(() => {
        expect(loadFileContents).toHaveBeenCalled();
        expect(saveFile).toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
        jest.clearAllMocks();
      });

      test('value is added when key does not exist', async () => {
        const orig = { asdf: true };
        const key = 'cool';
        const value = false;
        loadFileContents.mockReturnValueOnce(JSON.stringify(orig));

        await setStoreValue(key, value);

        expect(saveFile).toHaveBeenCalledWith(
          undefined,
          JSON.stringify({ ...orig, [key]: value }),
        );
      });

      test('value is updated when key exists', async () => {
        const key = 'cool';
        const value = false;
        const orig = { asdf: true, [key]: 'original' };
        loadFileContents.mockReturnValueOnce(JSON.stringify(orig));

        await setStoreValue(key, value);

        expect(saveFile).toHaveBeenCalledWith(
          undefined,
          JSON.stringify({ ...orig, [key]: value }),
        );
      });

      test('throws if could not save file', async () => {
        saveFile.mockImplementationOnce(async () => {
          throw new Error('Could not save file!');
        });
        expect(async () => setStoreValue('1234', false))
          .rejects
          .toThrow(DataFileIOError);
      });
    });

    describe('cache is not empty', () => {
      // mock cache having been set for this whole block.
      beforeEach(() => {
        mockCache.value = {};
        mockCache.hasValue.mockReturnValue(true);
        // empty cache should set set value correctly.
        mockCache.setValue.mockImplementation((x) => {
          mockCache.value = x;
        });
      });

      afterEach(() => {
        expect(saveFile).toHaveBeenCalled();
        expect(loadFileContents).not.toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
        jest.clearAllMocks();
      });

      test('value is added when key does not exist', async () => {
        const orig = { cool: false };
        const key = 'asdf';
        const value = true;
        const expected = { ...orig, [key]: value };
        mockCache.value = { ...orig };

        await setStoreValue(key, value);
        expect(saveFile).toHaveBeenCalledWith(undefined, JSON.stringify(expected));
        expect(mockCache.setValue).toHaveBeenCalledWith(expected);
      });

      test('value is updated when key exist', async () => {
        const key = 'asdf';
        const value = 'new';
        const orig = { cool: false, [key]: 'old' };
        const expected = { ...orig, [key]: value };
        mockCache.value = { ...orig };

        await setStoreValue(key, value);
        expect(saveFile).toHaveBeenCalledWith(undefined, JSON.stringify(expected));
        expect(mockCache.setValue).toHaveBeenCalledWith(expected);
      });

      test('throws if could not save file', async () => {
        saveFile.mockImplementationOnce(async () => {
          throw new Error('Could not save file!');
        });
        expect(async () => setStoreValue('1234', false))
          .rejects
          .toThrow(DataFileIOError);
      });
    });
  });
});
