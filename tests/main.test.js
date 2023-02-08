import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockCommander } from './mocks.js';

// setup mocks
mockConfig();
const mockCommand = mockCommander();
jest.unstable_mockModule('src/cli/auth.js', () => ({ authCommand: jest.fn() }));
jest.unstable_mockModule('src/cli/exitOverride.js', () => ({
  exitOverride: jest.fn(),
}));
jest.unstable_mockModule('src/cli/initialize.js', () => ({
  initializeCommand: jest.fn(),
}));
jest.unstable_mockModule('src/cli/solve.js', () => ({ solveCommand: jest.fn() }));
jest.unstable_mockModule('src/cli/stats.js', () => ({ statsCommand: jest.fn() }));
jest.unstable_mockModule('src/cli/submit.js', () => ({ submitCommand: jest.fn() }));
jest.unstable_mockModule('src/errorHandler.js', () => ({ handleError: jest.fn() }));
jest.unstable_mockModule('src/festive.js', () => ({ printFestiveTitle: jest.fn() }));

const commands = [
  { path: '../src/cli/auth.js', fnName: 'authCommand' },
  { path: '../src/cli/initialize.js', fnName: 'initializeCommand' },
  { path: '../src/cli/solve.js', fnName: 'solveCommand' },
  { path: '../src/cli/submit.js', fnName: 'submitCommand' },
  { path: '../src/cli/stats.js', fnName: 'statsCommand' },
];

describe('main', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test.each(commands)('adds "$fnName" command', async ({ path, fnName }) => {
    const module = await import(path);
    await import('../src/main.js');
    const calls = mockCommand.addCommand.mock.calls.flat();
    expect(calls).toContain(module[fnName]);
  });

  test('loads correct number of commands', async () => {
    // test is brittle on purpose, ensures if a new command is added in main
    // that this test suite must be updated with the new command too.
    await import('../src/main.js');
    expect(mockCommand.addCommand).toHaveBeenCalledTimes(commands.length);
  });

  test('invokes the CLI', async () => {
    await import('../src/main.js');
    expect(mockCommand.parseAsync).toHaveBeenCalledTimes(1);
  });

  test('handles error if CLI throws', async () => {
    const { handleError } = await import('../src/errorHandler.js');
    const error = new RangeError('WRONG');
    mockCommand.parseAsync.mockImplementationOnce(async () => {
      throw error;
    });
    await import('../src/main.js');
    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError).toHaveBeenCalledWith(error);
  });
});
