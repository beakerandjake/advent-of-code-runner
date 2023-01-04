import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
// jest.unstable_mockModule('fs-extra/esm', () => ({ copy: jest.fn() }));

// import after mocks set up
// const { copy } = await import('fs-extra/esm');
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
  });
});
