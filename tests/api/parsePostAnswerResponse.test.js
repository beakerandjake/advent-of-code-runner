import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';

// setup mocks
const easyMocks = [];
easyMock(easyMocks);
mockLogger();

// import after mocks set up
const { parsePostAnswerResponse } = await import(
  '../../src/api/parsePostAnswerResponse.js'
);

describe('submit command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws if no parser matches', async () => {
    await expect(() =>
      parsePostAnswerResponse('MATCHING THIS WILL FAIL')
    ).rejects.toThrow();
  });
});
