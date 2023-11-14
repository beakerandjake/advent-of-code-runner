import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';

// setup mocks.
const easyMocks = [
  ['@inquirer/prompts', ['confirm', 'password']],
  ['src/festive.js', ['festiveStyle']],
  ['src/initialize/createDotEnv.js', ['createDotEnv']],
  ['src/validation/userFilesExist.js', ['dotEnvExists', 'dataFileExists']],
];
easyMock(easyMocks);
mockLogger();

// import after setting up mocks
const { confirm, password, createDotEnv, dotEnvExists, dataFileExists } =
  await easyResolve(easyMocks);
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
