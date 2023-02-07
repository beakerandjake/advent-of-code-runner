import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
const logger = mockLogger();
const mockTerminalLink = jest.fn();
jest.unstable_mockModule('terminal-link', () => ({ default: mockTerminalLink }));
jest.unstable_mockModule('src/api/urls.js', () => ({ puzzleBaseUrl: jest.fn() }));

// import after setting up mocks
const { outputPuzzleLink } = await import('../../src/actions/outputPuzzleLink.js');

describe('outputPuzzleLink()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined])('throws if year is %s', (year) => {
    expect(() => outputPuzzleLink({ year, day: 10, level: 10 })).toThrow();
  });

  test.each([null, undefined])('throws if day is %s', (day) => {
    expect(() => outputPuzzleLink({ year: 2022, day, level: 10 })).toThrow();
  });

  test.each([null, undefined])('throws if level is %s', (level) => {
    expect(() => outputPuzzleLink({ year: 2022, day: 10, level })).toThrow();
  });

  test('outputs expected value', () => {
    const url = 'ASDF';
    const args = { year: 2022, day: 10, level: 50 };
    mockTerminalLink.mockReturnValue(url);
    outputPuzzleLink(args);
    expect(logger.festive).toHaveBeenCalledWith(
      `${url} (Year: ${args.year} Day: ${args.day} Level: ${args.level}) `
    );
  });
});
