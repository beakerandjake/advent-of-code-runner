import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
const printLinkMock = jest.fn();
const printChainMock = jest.fn();
const saveChainMock = jest.fn();
const saveLinkMock = jest.fn();
jest.unstable_mockModule('src/actions/actionChain.js', () => ({
  createChain: (links) => {
    if (links.includes(saveLinkMock)) {
      return saveChainMock;
    }
    if (links.includes(printLinkMock)) {
      return printChainMock;
    }
    return jest.fn();
  },
}));
jest.unstable_mockModule('src/actions/index.js', () => ({
  ifThen: jest.fn(),
  printProgressTable: printLinkMock,
  saveProgressTableToReadme: saveLinkMock,
  assertInitialized: jest.fn(),
  generateCliProgressTable: jest.fn(),
  generateMarkdownProgressTable: jest.fn(),
  getCompletionData: jest.fn(),
  getYear: jest.fn(),
}));

// import after mocks set up.
const { statsAction } = await import('../../src/cli/stats.js');

describe('stats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('prints to console by default', async () => {
    await statsAction();
    expect(printChainMock).toHaveBeenCalled();
  });

  test('prints to console if save option is false', async () => {
    await statsAction({ save: false });
    expect(printChainMock).toHaveBeenCalled();
  });

  test('saves to readme if save option is true', async () => {
    await statsAction({ save: true });
    expect(saveChainMock).toHaveBeenCalled();
  });
});
