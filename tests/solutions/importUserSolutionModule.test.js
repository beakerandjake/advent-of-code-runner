import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
jest.unstable_mockModule('node:url', () => ({
  pathToFileURL: (path) => ({ href: path }),
}));
class UserSolutionSyntaxErrorMock extends Error {
  constructor() {
    super();
    this.name = 'UserSolutionSyntaxErrorMock';
  }
}
class UserSolutionFileNotFoundErrorMock extends Error {
  constructor() {
    super();
    this.name = 'UserSolutionFileNotFoundErrorMock';
  }
}
jest.unstable_mockModule('src/errors/solutionWorkerErrors.js', () => ({
  UserSolutionFileNotFoundError: UserSolutionFileNotFoundErrorMock,
  UserSolutionSyntaxError: UserSolutionSyntaxErrorMock,
}));
// import after mocks set up.

describe('importUserSolutionModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('returns module', async () => {
    // mock an module we know exists
    const modulePath = 'src/main.js';
    const module = { levelOne: () => {} };
    jest.unstable_mockModule(modulePath, () => module);

    const { importUserSolutionModule } = await import(
      '../../src/solutions/importUserSolutionModule.js'
    );
    const result = await importUserSolutionModule(modulePath);
    expect(result).toMatchObject(module);
  });

  test('throws UserSolutionFileNotFoundError if file not found', async () => {
    // mock an module we know exists
    const modulePath = 'src/main.js';
    const error = new Error();
    error.code = 'ERR_MODULE_NOT_FOUND';
    jest.unstable_mockModule(modulePath, () => {
      throw error;
    });

    const { importUserSolutionModule } = await import(
      '../../src/solutions/importUserSolutionModule.js'
    );

    await expect(async () => importUserSolutionModule(modulePath)).rejects.toThrow(
      UserSolutionFileNotFoundErrorMock
    );
  });

  test('throws UserSolutionSyntaxError if file has syntax error', async () => {
    // mock an module we know exists
    const modulePath = 'src/main.js';
    jest.unstable_mockModule(modulePath, () => {
      throw new SyntaxError();
    });

    const { importUserSolutionModule } = await import(
      '../../src/solutions/importUserSolutionModule.js'
    );

    await expect(async () => importUserSolutionModule(modulePath)).rejects.toThrow(
      UserSolutionSyntaxErrorMock
    );
  });

  test('throws on unknown error', async () => {
    // mock an module we know exists
    const modulePath = 'src/main.js';
    jest.unstable_mockModule(modulePath, () => {
      throw new RangeError();
    });

    const { importUserSolutionModule } = await import(
      '../../src/solutions/importUserSolutionModule.js'
    );

    await expect(async () => importUserSolutionModule(modulePath)).rejects.toThrow(
      RangeError
    );
  });
});
