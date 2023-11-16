import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger, easyMock, easyResolve, mockConfig } from '../mocks.js';

// setup mocks
const easyMocks = [['src/commands/stats.js', ['statsAction']]];
easyMock(easyMocks);
mockLogger();
const { getConfigValue } = mockConfig();

// import after mocks set up.
const { statsAction } = await easyResolve(easyMocks);
const { autoUpdateReadme } = await import(
  '../../src/tables/autoUpdateReadme.js'
);

describe('autoUpdateReadme()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('does not update readme if not configured to do so', async () => {
    getConfigValue.mockImplementation((key) => {
      if (key === 'disableReadmeAutoSaveProgress') {
        return true;
      }
      throw new Error('unknown key');
    });
    await autoUpdateReadme();
    expect(statsAction).not.toHaveBeenCalled();
  });

  test('update readme if configured to do so', async () => {
    getConfigValue.mockImplementation((key) => {
      if (key === 'disableReadmeAutoSaveProgress') {
        return false;
      }
      throw new Error('unknown key');
    });
    await autoUpdateReadme();
    expect(statsAction).toHaveBeenCalled();
  });

  test('passes save option to statsAction', async () => {
    getConfigValue.mockImplementation((key) => {
      if (key === 'disableReadmeAutoSaveProgress') {
        return false;
      }
      throw new Error('unknown key');
    });
    await autoUpdateReadme();
    expect(statsAction).toHaveBeenCalledWith({ save: true });
  });
});
