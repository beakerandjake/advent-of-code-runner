import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('node:fs/promises', () => ({ readFile: jest.fn() }));
jest.unstable_mockModule('fs-extra/esm', () => ({ outputFile: jest.fn() }));
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({
  readmeExists: jest.fn(),
}));

// import after setting up mocks
const { readFile } = await import('node:fs/promises');
const { outputFile } = await import('fs-extra/esm');
const { readmeExists } = await import('../../src/validation/userFilesExist.js');
const { saveProgressTableToReadme } = await import(
  '../../src/actions/saveProgressTableToReadme.js'
);

describe('saveProgressTableToReadme()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined, ''])(
    'throws if progressTable is: "%s"',
    async (progressTable) => {
      await expect(async () =>
        saveProgressTableToReadme({ progressTable })
      ).rejects.toThrow();
    }
  );

  test('halts chain if readme does not exist', async () => {
    readmeExists.mockResolvedValue(false);
    const result = await saveProgressTableToReadme({ progressTable: 'ASDF' });
    expect(result).toBe(false);
    expect(outputFile).not.toHaveBeenCalled();
  });

  test('halts chain if enclosing tag is missing', async () => {
    readmeExists.mockResolvedValue(true);
    readFile.mockResolvedValue('ASDF ASDF ASDF!');
    const result = await saveProgressTableToReadme({ progressTable: 'ASDF' });
    expect(result).toBe(false);
    expect(outputFile).not.toHaveBeenCalled();
  });

  test('replaces content of enclosing tag', async () => {
    const originalFileContents =
      '\n<!--START_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->ORIGINAL CONTENT BLAH BLAH<!--END_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->';
    readmeExists.mockResolvedValue(true);
    readFile.mockResolvedValue(originalFileContents);
    const input = 'NEW FILE CONTENTS HA HA HA!';
    await saveProgressTableToReadme({ progressTable: input });
    expect(outputFile).toHaveBeenCalledWith(
      undefined,
      `\n<!--START_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->\n${input}\n<!--END_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->`
    );
  });
});
