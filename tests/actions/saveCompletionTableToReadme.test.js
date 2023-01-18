import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('node:fs/promises', () => ({ readFile: jest.fn() }));
jest.unstable_mockModule('fs-extra/esm', () => ({ outputFile: jest.fn() }));
jest.unstable_mockModule('src/api/urls.js', () => ({ puzzleBaseUrl: jest.fn() }));
jest.unstable_mockModule('src/formatting.js', () => ({ humanizeDuration: jest.fn() }));
jest.unstable_mockModule('src/validation/validatePuzzle.js', () => ({ getTotalPuzzleCount: jest.fn() }));
jest.unstable_mockModule('src/statistics.js', () => ({
  getAverageAttempts: jest.fn(),
  getAverageRuntime: jest.fn(),
  getFastestRuntime: jest.fn(),
  getMaxAttempts: jest.fn(),
  getPuzzleCompletionData: jest.fn(),
  getSlowestRuntime: jest.fn(),
  getSolvedCount: jest.fn(),
}));

// import after setting up mocks
const {
  tr, italic, bold, saveCompletionTableToReadme,
} = await import('../../src/actions/saveCompletionTableToReadme.js');

describe('saveCompletionTableToReadme()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('tr()', () => {
    test('joins values', () => {
      const values = ['ASDF', '1234', 'ASDF'];
      const result = tr(values);
      expect(result).toContain(values.join(' | '));
    });

    test('adds leading and trailing pipes', () => {
      const result = tr(['asdf', '1234']);
      expect(result.startsWith('| ')).toBe(true);
      expect(result.endsWith(' |')).toBe(true);
    });
  });

  describe('italic()', () => {
    test('generates correct markdown', () => {
      const input = 'ASDF';
      const result = italic(input);
      expect(result).toBe(`*${input}*`);
    });
  });

  describe('bold()', () => {
    test('generates correct markdown', () => {
      const input = 'ASDF';
      const result = bold(input);
      expect(result).toBe(`**${input}**`);
    });
  });

  // test.each([
  //   null, undefined,
  // ])('throws if year is %s', (year) => {
  //   expect(() => outputPuzzleLink({ year, day: 10, level: 10 })).toThrow();
  // });
});
