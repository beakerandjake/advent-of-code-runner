import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';

// setup mocks.
mockLogger();
jest.unstable_mockModule('@inquirer/prompts', () => ({
  confirm: jest.fn(),
  password: jest.fn(),
}));
jest.unstable_mockModule('src/festive.js', () => ({
  festiveStyle: jest.fn(),
}));
jest.unstable_mockModule('src/initialize/index.js', () => ({
  createDotEnv: jest.fn(),
}));
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({
  dotEnvExists: jest.fn(),
  dataFileExists: jest.fn(),
}));

// import after setting up mocks
const { confirm, password } = await import('@inquirer/prompts');
const { createDotEnv } = await import('../../src/initialize/index.js');
const { dotEnvExists, dataFileExists } = await import(
  '../../src/validation/userFilesExist.js'
);
const { authAction } = await import('../../src/cli/auth.js');

describe('authAction()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws if not initialized', async () => {
    dataFileExists.mockResolvedValue(false);
    await expect(async () => authAction()).rejects.toThrowError(
      DirectoryNotInitializedError
    );
  });

  test('asks users confirmation if .env file exists', async () => {
    dataFileExists.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    confirm.mockResolvedValue(false);
    await authAction();
    expect(confirm).toHaveBeenCalled();
  });

  test('does not update .env file if user does not confirm', async () => {
    dataFileExists.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    confirm.mockResolvedValue(false);
    await authAction();
    expect(confirm).toHaveBeenCalled();
    expect(createDotEnv).not.toHaveBeenCalled();
  });

  test('creates dotenv if user confirms', async () => {
    dataFileExists.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    confirm.mockResolvedValue(true);
    password.mockResolvedValue('ASDF');
    await authAction();
    expect(createDotEnv).toHaveBeenCalled();
  });

  test('passes returned token to createDotEnv', async () => {
    const token = 'COOL TOKEN!';
    dataFileExists.mockResolvedValue(true);
    dotEnvExists.mockResolvedValue(true);
    confirm.mockResolvedValue(true);
    password.mockResolvedValue(token);
    await authAction();
    expect(createDotEnv).toHaveBeenCalledWith(token);
  });
});
