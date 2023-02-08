import { describe, jest, test, afterEach } from '@jest/globals';
import { mockCommander, mockConfig } from '../mocks.js';

// setup mocks
mockCommander();
mockConfig();
const actionChainMock = jest.fn();
jest.unstable_mockModule('src/actions/actionChainWithProgress.js', () => ({
  createChainWithProgress: () => actionChainMock,
}));
const assertUserConfirmationMock = jest.fn();
const getAnswersFromUserMock = jest.fn();
jest.unstable_mockModule('src/actions/index.js', () => ({
  assertUserConfirmation: () => assertUserConfirmationMock,
  getAnswersFromUser: () => getAnswersFromUserMock,
}));
jest.unstable_mockModule('src/festive.js', () => ({
  festiveEmoji: jest.fn(),
  festiveStyle: jest.fn(),
  printFestiveTitle: jest.fn(),
}));
jest.unstable_mockModule('src/initialize/index.js', () => ({
  createDataFile: jest.fn(),
  createDotEnv: jest.fn(),
  createGitIgnore: jest.fn(),
  createPackageJson: jest.fn(),
  createReadme: jest.fn(),
  createSolutionFiles: jest.fn(),
  cwdIsEmpty: jest.fn(),
  deleteExistingInputFiles: jest.fn(),
  installPackages: jest.fn(),
}));
jest.unstable_mockModule('src/cli/auth.js', () => ({
  authTokenQuestion: () => jest.fn(),
}));

// import after mocks set up.
const { cwdIsEmpty } = await import('../../src/initialize/index.js');
const { initializeAction } = await import('../../src/cli/initialize.js');

describe('initialize command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('does not ask for confirmation if cwd is empty', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    getAnswersFromUserMock.mockResolvedValue({ answers: {} });
    await initializeAction();
    expect(assertUserConfirmationMock).not.toHaveBeenCalled();
  });

  test('asks for confirmation if cwd is not empty', async () => {
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmationMock.mockResolvedValue(false);
    await initializeAction();
    expect(assertUserConfirmationMock).toHaveBeenCalled();
  });

  test('aborts if user does not confirm', async () => {
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmationMock.mockResolvedValue(false);
    await initializeAction();
    expect(actionChainMock).not.toHaveBeenCalled();
  });

  test('continues if user confirms', async () => {
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmationMock.mockResolvedValue(true);
    getAnswersFromUserMock.mockResolvedValue({ answers: {} });
    await initializeAction();
    expect(actionChainMock).toHaveBeenCalled();
  });
});
