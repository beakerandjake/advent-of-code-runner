import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger, mockCommander } from '../mocks.js';

// setup mocks.
mockLogger();
mockCommander();
jest.unstable_mockModule('src/actions/index.js', () => ({
  assertInitialized: jest.fn(),
  assertUserConfirmation: jest.fn(),
  getAnswersFromUser: jest.fn(),
  and:
    (a, b) =>
    async (...args) =>
      (await a(...args)) && b(...args),
}));
jest.unstable_mockModule('src/actions/actionChain.js', () => ({
  createChain: (links) => async (args) => {
    let currentArgs = args;
    for (const link of links) {
      // eslint-disable-next-line no-await-in-loop
      const result = await link(args);
      if (result === false) {
        break;
      }
      if (result !== true && result !== undefined) {
        currentArgs = { ...currentArgs, ...result };
      }
    }
  },
}));
jest.unstable_mockModule('src/festive.js', () => ({
  festiveStyle: jest.fn(),
  printFestiveTitle: jest.fn(),
}));
jest.unstable_mockModule('src/initialize/index.js', () => ({
  createDotEnv: jest.fn(),
}));
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({
  dotEnvExists: jest.fn(),
}));

// import after mocks are setup.
const { assertInitialized, assertUserConfirmation, getAnswersFromUser } = await import(
  '../../src/actions/index.js'
);
const { createDotEnv } = await import('../../src/initialize/index.js');
const { dotEnvExists } = await import('../../src/validation/userFilesExist.js');
const { authAction } = await import('../../src/cli/auth.js');

describe('auth command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('bails if user has not initialized', async () => {
    assertInitialized.mockResolvedValue(false);
    await authAction();
    expect(createDotEnv).not.toHaveBeenCalled();
  });

  test('confirms with user if .env file exists', async () => {
    assertInitialized.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    assertUserConfirmation.mockResolvedValue(false);
    await authAction();
    expect(assertUserConfirmation).toHaveBeenCalled();
  });

  test('bails if user does not confirm', async () => {
    assertInitialized.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    assertUserConfirmation.mockResolvedValue(false);
    await authAction();
    expect(createDotEnv).not.toHaveBeenCalled();
  });

  test('creates dotenv if user confirms', async () => {
    assertInitialized.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    assertUserConfirmation.mockResolvedValue(true);
    getAnswersFromUser.mockResolvedValue({});
    await authAction();
    expect(createDotEnv).toHaveBeenCalled();
  });
});
