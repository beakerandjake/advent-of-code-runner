import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();
// jest.unstable_mockModule('commander', () => ({ Command: jest.fn() }));
jest.unstable_mockModule('src/actions/assertInitialized.js', () => ({ assertInitialized: jest.fn() }));
jest.unstable_mockModule('src/actions/assertUserConfirmation.js', () => ({ assertUserConfirmation: jest.fn() }));
jest.unstable_mockModule('src/actions/getAnswersFromUser.js', () => ({ getAnswersFromUser: jest.fn() }));
jest.unstable_mockModule('src/festive.js', () => ({
  festiveEmoji: jest.fn(),
  festiveStyle: jest.fn(),
  printFestiveTitle: jest.fn(),
}));
jest.unstable_mockModule('src/initialize/index.js', () => ({ dotEnvFileExists: jest.fn(), createDotEnv: jest.fn() }));

// import after mocks are setup.
const { assertInitialized } = await import('../../src/actions/assertInitialized.js');
const { assertUserConfirmation } = await import('../../src/actions/assertUserConfirmation.js');
const { getAnswersFromUser } = await import('../../src/actions/getAnswersFromUser.js');
const { dotEnvFileExists, createDotEnv } = await import('../../src/initialize/index.js');
const { auth } = await import('../../src/cli/auth.js');

describe('cli', () => {
  describe('auth()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('bails if user has not initialized', async () => {
      assertInitialized.mockResolvedValue(false);
      await auth();
      expect(createDotEnv).not.toHaveBeenCalled();
    });

    test('confirms with user if .env file exists', async () => {
      assertInitialized.mockResolvedValue(true);
      dotEnvFileExists.mockResolvedValue(true);
      assertUserConfirmation.mockReturnValue(() => Promise.resolve(false));
      await auth();
      expect(assertUserConfirmation).toHaveBeenCalled();
    });

    test('bails if user does not confirm', async () => {
      assertInitialized.mockResolvedValue(true);
      dotEnvFileExists.mockResolvedValue(true);
      assertUserConfirmation.mockReturnValue(() => Promise.resolve(false));
      await auth();
      expect(createDotEnv).not.toHaveBeenCalled();
    });

    test('creates dotenv if user confirms', async () => {
      assertInitialized.mockResolvedValue(true);
      dotEnvFileExists.mockResolvedValue(true);
      assertUserConfirmation.mockReturnValue(() => Promise.resolve(true));
      getAnswersFromUser.mockReturnValue(() => Promise.resolve({}));
      await auth();
      expect(createDotEnv).toHaveBeenCalled();
    });
  });
});
