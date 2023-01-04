import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('node:child_process', () => ({ exec: jest.fn() }));
jest.unstable_mockModule('node:path', () => ({ join: jest.fn() }));
jest.unstable_mockModule('fs-extra/esm', () => ({ readJson: jest.fn(), writeJson: jest.fn() }));

// import after mocks set up
const { exec } = await import('node:child_process');
const { readJson, writeJson } = await import('fs-extra/esm');
const { createPackageJson } = await import('../../src/initialize/createPackageJson.js');

describe('initialize', () => {
  describe('createPackageJson()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      null, undefined, { year: null }, { year: undefined }, {},
    ])('throws if given args: "%s"', async (year) => {
      await expect(async () => createPackageJson(year)).rejects.toThrow();
    });

    test('resolves promise when no exec error', async () => {
      exec.mockImplementation((command, options, callback) => callback());
      readJson.mockResolvedValue({});
      const result = createPackageJson({ year: 2022 });
      await expect(result).resolves.not.toThrow();
      expect(writeJson).toHaveBeenCalled();
    });

    test('throws if exec error', async () => {
      exec.mockImplementation((command, options, callback) => callback(new Error()));
      const result = createPackageJson({ year: 2022 });
      await expect(result).rejects.toThrow();
      expect(writeJson).not.toHaveBeenCalled();
    });
  });
});
