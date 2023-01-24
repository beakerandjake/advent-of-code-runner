import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger, mockConfig } from '../mocks.js';

// setup mocks.
mockLogger();
mockConfig();

jest.unstable_mockModule('fs-extra/esm', () => ({
  readJson: jest.fn(),
  writeJson: jest.fn(),
  pathExists: jest.fn(),
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
const { readJson, writeJson, pathExists } = await import('fs-extra/esm');
const { getValue, setValue } = await import('../../src/persistence/userDataFile.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('userDataFile', () => {
  describe('getValue()', () => {
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
        expect(readJson).toHaveBeenCalled();
        jest.resetAllMocks();
      });

      test('loadFileContents is called', async () => {
        await getValue('1234');
        expect(readJson).toBeCalled();
      });

      test('throws if load file fails', async () => {
        readJson.mockRejectedValue(new Error('Could not load file!'));
        expect(async () => getValue('2134')).rejects.toThrow();
      });

      test('returns default value if user data file has no contents', async () => {
        const defaultValue = 45;
        readJson.mockResolvedValue('');
        expect(await getValue('1234', defaultValue)).toEqual(defaultValue);
      });

      test('returns default value if key not found', async () => {
        const defaultValue = 45;
        readJson.mockResolvedValue({ one: 1, two: 2, three: 3 });
        expect(await getValue('four', defaultValue)).toEqual(defaultValue);
      });

      test('returns undefined if key not found and no default provided', async () => {
        readJson.mockResolvedValue({ one: 1, two: 2, three: 3 });
        expect(await getValue('four')).toEqual(undefined);
      });

      test('returns value if key found', async () => {
        const expected = 4;
        const key = 'four';
        readJson.mockResolvedValue({ one: 1, [key]: expected });
        expect(await getValue(key, 66)).toEqual(expected);
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
        expect(readJson).not.toHaveBeenCalled();
        jest.clearAllMocks();
      });

      test('returns value if key found', async () => {
        const key = 'test';
        const value = 'ASDF';
        mockCache.value = { [key]: value };
        expect(await getValue(key)).toBe(value);
      });

      test('returns default value if key not found', async () => {
        const expected = 'default';
        mockCache.value = { 'not key': '1234' };
        expect(await getValue('key', 'default')).toBe(expected);
      });

      test('returns undefined if key not found and no default provided', async () => {
        mockCache.value = { 'not key': '1234' };
        expect(await getValue('key')).toBe(undefined);
      });
    });
  });

  describe('setValue()', () => {
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
        expect(readJson).toHaveBeenCalled();
        expect(writeJson).toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
        jest.resetAllMocks();
      });

      test('value is added when key does not exist', async () => {
        const orig = { asdf: true };
        const key = 'cool';
        const value = false;
        readJson.mockResolvedValue(orig);

        await setValue(key, value);

        expect(writeJson).toHaveBeenCalledWith(
          undefined,
          { ...orig, [key]: value },
        );
      });

      test('value is updated when key exists', async () => {
        const key = 'cool';
        const value = false;
        const orig = { asdf: true, [key]: 'original' };
        readJson.mockResolvedValue(orig);

        await setValue(key, value);

        expect(writeJson).toHaveBeenCalledWith(
          undefined,
          { ...orig, [key]: value },
        );
      });

      test('throws if could not save file', async () => {
        writeJson.mockImplementationOnce(async () => {
          throw new Error('Could not save file!');
        });
        expect(async () => setValue('1234', false)).rejects.toThrow();
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
        expect(writeJson).toHaveBeenCalled();
        expect(readJson).not.toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
        jest.resetAllMocks();
      });

      test('value is added when key does not exist', async () => {
        const orig = { cool: false };
        const key = 'asdf';
        const value = true;
        const expected = { ...orig, [key]: value };
        mockCache.value = { ...orig };

        await setValue(key, value);
        expect(writeJson).toHaveBeenCalledWith(undefined, expected);
        expect(mockCache.setValue).toHaveBeenCalledWith(expected);
      });

      test('value is updated when key exist', async () => {
        const key = 'asdf';
        const value = 'new';
        const orig = { cool: false, [key]: 'old' };
        const expected = { ...orig, [key]: value };
        mockCache.value = { ...orig };

        await setValue(key, value);
        expect(writeJson).toHaveBeenCalledWith(undefined, expected);
        expect(mockCache.setValue).toHaveBeenCalledWith(expected);
      });

      test('throws if could not save file', async () => {
        writeJson.mockRejectedValue(new Error('Could not save file!'));
        expect(async () => setValue('1234', false)).rejects.toThrow();
      });
    });
  });
});
