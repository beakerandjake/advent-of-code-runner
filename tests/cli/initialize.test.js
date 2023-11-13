import { describe, jest, test, afterEach, beforeEach } from '@jest/globals';
import { mockCommander, mockConfig } from '../mocks.js';

// setup mocks
mockCommander();
const { getConfigValue } = mockConfig();
const actionChainMock = jest.fn();
jest.unstable_mockModule('src/actions/actionChainWithProgress.js', () => ({
  createChainWithProgress: () => actionChainMock,
}));
jest.unstable_mockModule('src/actions/index.js', () => ({
  assertUserConfirmation: jest.fn(),
  getAnswersFromUser: jest.fn(),
}));
jest.unstable_mockModule('src/festive.js', () => ({
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
  authTokenQuestion: {},
}));

// import after mocks set up.
const { assertUserConfirmation, getAnswersFromUser } = await import(
  '../../src/actions/index.js'
);
const { cwdIsEmpty } = await import('../../src/initialize/index.js');

describe('initialize command', () => {
  beforeEach(() => {
    getConfigValue.mockImplementation((key) =>
      key === 'aoc.validation.years' ? [2001, 2002, 2003, 2004] : undefined
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('does not ask for confirmation if cwd is empty', async () => {
    const { initializeAction } = await import('../../src/cli/initialize.js');
    cwdIsEmpty.mockResolvedValue(true);
    assertUserConfirmation.mockResolvedValue({});
    await initializeAction();
    expect(assertUserConfirmation).not.toHaveBeenCalled();
  });

  test('asks for confirmation if cwd is not empty', async () => {
    const { initializeAction } = await import('../../src/cli/initialize.js');
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmation.mockResolvedValue(false);
    await initializeAction();
    expect(assertUserConfirmation).toHaveBeenCalled();
  });

  test('aborts if user does not confirm', async () => {
    const { initializeAction } = await import('../../src/cli/initialize.js');
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmation.mockResolvedValue(false);
    await initializeAction();
    expect(actionChainMock).not.toHaveBeenCalled();
  });

  test('continues if user confirms', async () => {
    const { initializeAction } = await import('../../src/cli/initialize.js');
    cwdIsEmpty.mockResolvedValue(false);
    assertUserConfirmation.mockResolvedValue(true);
    getAnswersFromUser.mockResolvedValue({ answers: {} });
    await initializeAction();
    expect(actionChainMock).toHaveBeenCalled();
  });
});
