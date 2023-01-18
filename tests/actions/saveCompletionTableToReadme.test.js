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
  tr,
  italic,
  bold,
  mapNameColumn,
  mapSolvedColumn,
  mapAttemptColumns,
  saveCompletionTableToReadme,
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

  describe('mapNamedColumn()', () => {
    test('outputs expected value', () => {
      const input = { day: 10, level: 11 };
      const result = mapNameColumn(input);
      expect(result).toBe([input.day, input.level].join('.'));
    });
  });

  describe('mapSolvedColumn()', () => {
    test('returns empty on not solved', () => {
      const input = { solved: false };
      const result = mapSolvedColumn(input);
      expect(result).toBe('');
    });

    test('returns value on solved', () => {
      const input = { solved: true };
      const result = mapSolvedColumn(input);
      expect(result).not.toBe('');
    });
  });

  describe('mapAttemptColumns()', () => {
    test.each([
      null, undefined,
    ])('returns empty string if provided: "%s"', (numberOfAttempts) => {
      const input = [{ numberOfAttempts }];
      const result = mapAttemptColumns(input);
      expect(result).toEqual(['']);
    });

    test('returns value if no max attempts', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input);
      expect(result).toEqual(input.map((x) => x.numberOfAttempts.toString()));
    });

    test('returns value if max attempt not equal to value', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input, 445);
      expect(result).toEqual(input.map((x) => x.numberOfAttempts.toString()));
    });

    test('appends (worst) if value equal to max attempt', () => {
      const input = [{ numberOfAttempts: 10 }];
      const result = mapAttemptColumns(input, input[0].numberOfAttempts);
      expect(result[0]).toContain('(worst)');
    });
  });

  // test.each([
  //   null, undefined,
  // ])('throws if year is %s', (year) => {
  //   expect(() => outputPuzzleLink({ year, day: 10, level: 10 })).toThrow();
  // });
});
