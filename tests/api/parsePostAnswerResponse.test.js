import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import {
  badLevel,
  correctAnswerDayComplete,
  correctAnswerDayIncomplete,
} from './getActualResponseHtml.js';

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

  test('returns correct if response success, day incomplete', async () => {
    const { correct } = await parsePostAnswerResponse(
      correctAnswerDayIncomplete.html
    );
    expect(correct).toBe(true);
  });

  test('returns expected message if response success, day incomplete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayIncomplete.html
    );
    expect(message).toBe(
      "That's the right answer! You are one gold star closer to collecting enough start fruit."
    );
  });

  test('returns correct if response success, day complete', async () => {
    const { correct } = await parsePostAnswerResponse(
      correctAnswerDayComplete.html
    );
    expect(correct).toBe(true);
  });

  test('returns expected message if response success, day complete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayComplete.html
    );
    expect(message).toMatch(
      /That's the right answer! You are one gold star closer to collecting enough start fruit. You have completed Day \d+!/
    );
  });

  test('returns incorrect if response incorrect, solving wrong level', async () => {
    const { correct } = await parsePostAnswerResponse(badLevel.html);
    expect(correct).toBe(false);
  });

  test('returns expected message if response incorrect, solving wrong level', async () => {
    const { message } = await parsePostAnswerResponse(badLevel.html);
    expect(message).toBe(
      "You don't seem to be solving the right level. Did you already complete it?"
    );
  });
});
