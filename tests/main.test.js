import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, easyMock, easyResolve } from './mocks.js';

// setup mocks
const easyMocks = [
  ['src/commands/auth.js', ['authAction']],
  ['src/commands/init.js', ['initAction']],
  ['src/commands/solve.js', ['solveAction']],
  ['src/commands/stats.js', ['statsAction']],
  ['src/commands/submit.js', ['submitAction']],
  ['src/errorHandler.js', ['handleError']],
  ['src/festive.js', ['printFestiveTitle']],
  ['src/validation/validateArgs.js', ['intParser']],
];
easyMock(easyMocks);
mockConfig();
const mockCommander = (() => {
  const toReturn = {
    name: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
    addHelpText: jest.fn().mockReturnThis(),
    command: jest.fn().mockReturnThis(),
    hook: jest.fn().mockReturnThis(),
    action: jest.fn().mockReturnThis(),
    addArgument: jest.fn().mockReturnThis(),
    option: jest.fn().mockReturnThis(),
    parseAsync: jest.fn(),
  };
  jest.unstable_mockModule('commander', () => ({
    // eslint-disable-next-line func-names, object-shorthand
    Command: function () {
      return toReturn;
    },
    // eslint-disable-next-line func-names, object-shorthand
    Argument: function () {
      return {
        argParser: jest.fn().mockReturnThis(),
      };
    },
  }));
  return toReturn;
})();

// import after mocks set up
const {
  authAction,
  initAction,
  solveAction,
  statsAction,
  submitAction,
  handleError,
} = await easyResolve(easyMocks);

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    ['auth', authAction],
    ['init', initAction],
    ['solve', solveAction],
    ['submit', submitAction],
    ['stats', statsAction],
  ])('adds command %s', async (name, action) =>
    jest.isolateModulesAsync(async () => {
      await import('../src/main.js');
      const commandIndex = mockCommander.command.mock.calls
        .flat()
        .indexOf(name);
      const actionIndex = mockCommander.action.mock.calls
        .flat()
        .indexOf(action);
      expect(commandIndex).not.toBe(-1);
      expect(actionIndex).not.toBe(-1);
      expect(commandIndex).toBe(actionIndex);
    })
  );

  test('invokes the CLI', async () =>
    jest.isolateModulesAsync(async () => {
      await import('../src/main.js');
      expect(mockCommander.parseAsync).toHaveBeenCalledTimes(1);
    }));

  test('invokes errorHandler on exception', async () =>
    jest.isolateModulesAsync(async () => {
      const error = new Error('BAD');
      mockCommander.parseAsync.mockRejectedValue(error);
      await import('../src/main.js');
      expect(handleError).toHaveBeenCalledWith(error);
    }));
});
