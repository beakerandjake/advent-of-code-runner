import { describe, jest, test, afterEach } from '@jest/globals';
import { easyResolve, easyMock, mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();
const { getConfigValue } = mockConfig();
const oraMock = {
  text: null,
  isSpinning: false,
  start: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
  stop: jest.fn(),
};
const easyMocks = [
  ['@inquirer/prompts', ['confirm', 'password', 'select']],
  ['src/festive.js', ['festiveStyle']],
  ['src/initialize/cwdIsEmpty.js', ['cwdIsEmpty']],
  ['src/initialize/createDataFile.js', ['createDataFile']],
  ['src/initialize/createDotEnv.js', ['createDotEnv']],
  ['src/initialize/createGitIgnore.js', ['createGitIgnore']],
  ['src/initialize/createPackageJson.js', ['createPackageJson']],
  ['src/initialize/createReadme.js', ['createReadme']],
  ['src/initialize/createSolutionFiles.js', ['createSolutionFiles']],
  ['src/initialize/deleteExistingInputFiles.js', ['deleteExistingInputFiles']],
  ['src/initialize/installPackages.js', ['installPackages']],
  ['src/commands/auth.js', [['authTokenPrompt', {}]]],
  ['ora', [['default', () => oraMock]]],
];
easyMock(easyMocks);

// import after mocks set up.
const {
  confirm,
  password,
  select,
  cwdIsEmpty,
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  deleteExistingInputFiles,
  installPackages,
} = await easyResolve(easyMocks);

/**
 * setup mock BEFORE importing the action or else error due to:
 *  choices: [...getConfigValue('aoc.validation.years')]
 *    .reverse()
 *    .map((year) => ({ value: year })),
 */
getConfigValue.mockImplementation((key) => {
  if (key === 'aoc.validation.years') {
    return [2001, 2002, 2003, 2004];
  }
  throw new Error('unknown key');
});
const { initializeAction } = await import('../../src/commands/init.js');

describe('initialize command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('asks user confirmation if cwd is not empty', async () => {
    cwdIsEmpty.mockResolvedValue(false);
    confirm.mockResolvedValue(false);
    await initializeAction();
    expect(cwdIsEmpty).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalled();
  });

  test('does not ask user confirmation if cwd is empty', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('ASDF');
    await initializeAction();
    expect(cwdIsEmpty).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('aborts if user does not confirm', async () => {
    cwdIsEmpty.mockResolvedValue(false);
    confirm.mockResolvedValue(false);
    await initializeAction();
    expect(confirm).toHaveBeenCalled();
    expect(createDataFile).not.toHaveBeenCalled();
    expect(createDotEnv).not.toHaveBeenCalled();
    expect(createGitIgnore).not.toHaveBeenCalled();
    expect(createPackageJson).not.toHaveBeenCalled();
    expect(createReadme).not.toHaveBeenCalled();
    expect(createSolutionFiles).not.toHaveBeenCalled();
    expect(deleteExistingInputFiles).not.toHaveBeenCalled();
    expect(installPackages).not.toHaveBeenCalled();
  });

  test('throws if no year', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue('');
    password.mockResolvedValue('ASDF');
    await expect(async () => initializeAction()).rejects.toThrow();
  });

  test('throws if no token', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('');
    await expect(async () => initializeAction()).rejects.toThrow();
  });

  test('starts spinner before initializing', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('Cool!');
    await initializeAction();
    expect(oraMock.start).toHaveBeenCalledBefore(createDataFile);
    expect(oraMock.start).toHaveBeenCalledBefore(createDotEnv);
    expect(oraMock.start).toHaveBeenCalledBefore(createGitIgnore);
    expect(oraMock.start).toHaveBeenCalledBefore(createPackageJson);
    expect(oraMock.start).toHaveBeenCalledBefore(createReadme);
    expect(oraMock.start).toHaveBeenCalledBefore(createSolutionFiles);
    expect(oraMock.start).toHaveBeenCalledBefore(deleteExistingInputFiles);
    expect(oraMock.start).toHaveBeenCalledBefore(installPackages);
  });

  test('stops spinner after initializing', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('Cool!');
    await initializeAction();
    expect(oraMock.succeed).toHaveBeenCalledAfter(createDataFile);
    expect(oraMock.succeed).toHaveBeenCalledAfter(createDotEnv);
    expect(oraMock.succeed).toHaveBeenCalledAfter(createGitIgnore);
    expect(oraMock.succeed).toHaveBeenCalledAfter(createPackageJson);
    expect(oraMock.succeed).toHaveBeenCalledAfter(createReadme);
    expect(oraMock.succeed).toHaveBeenCalledAfter(createSolutionFiles);
    expect(oraMock.succeed).toHaveBeenCalledAfter(deleteExistingInputFiles);
    expect(oraMock.succeed).toHaveBeenCalledAfter(installPackages);
  });

  test('fails spinner on error', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('Cool!');
    createDataFile.mockRejectedValue(new Error('better stop!'));
    await expect(async () => initializeAction()).rejects.toThrow();
    expect(oraMock.fail).toHaveBeenCalled();
  });

  test('creates package json before installing packages', async () => {
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('Cool!');
    await initializeAction();
    expect(createPackageJson).toHaveBeenCalledBefore(installPackages);
  });

  test.each([
    ['createDataFile', createDataFile],
    ['createDotEnv', createDotEnv],
    ['createGitIgnore', createGitIgnore],
    ['createPackageJson', createPackageJson],
    ['createReadme', createReadme],
    ['createSolutionFiles', createSolutionFiles],
    ['deleteExistingInputFiles', deleteExistingInputFiles],
    ['installPackages', installPackages],
  ])('throws if %s() throws', async (name, mockFn) => {
    mockFn.mockRejectedValue(new Error('better stop!'));
    cwdIsEmpty.mockResolvedValue(true);
    select.mockResolvedValue(2022);
    password.mockResolvedValue('Cool!');
    await expect(async () => initializeAction()).rejects.toThrow();
  });
});
