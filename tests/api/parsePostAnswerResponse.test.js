import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import {
  badLevel,
  correctAnswerDayComplete,
  correctAnswerDayIncomplete,
  gaveAnswerTooRecently,
  notTheRightAnswer,
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

  test('returns expected message if response: success, day incomplete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayIncomplete.html
    );
    expect(message).toBe(
      "That's the right answer! You are one gold star closer to collecting enough start fruit."
    );
  });

  test('returns correct if response: success, day complete', async () => {
    const { correct } = await parsePostAnswerResponse(
      correctAnswerDayComplete.html
    );
    expect(correct).toBe(true);
  });

  test('returns expected message if response: success, day complete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayComplete.html
    );
    expect(message).toMatch(
      /That's the right answer! You are one gold star closer to collecting enough start fruit. You have completed Day \d+!/
    );
  });

  test('returns incorrect if response: incorrect, solving wrong level', async () => {
    const { correct } = await parsePostAnswerResponse(badLevel.html);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: incorrect, solving wrong level', async () => {
    const { message } = await parsePostAnswerResponse(badLevel.html);
    expect(message).toBe(
      "You don't seem to be solving the right level. Did you already complete it?"
    );
  });

  test('returns incorrect if response: incorrect, no to high / low.', async () => {
    const { correct } = await parsePostAnswerResponse(notTheRightAnswer);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: incorrect, no to high / low.', async () => {
    const { message } = await parsePostAnswerResponse(notTheRightAnswer);
    expect(message).toBe("That's not the right answer.");
  });

  test('returns incorrect if response: gave answer too recently.', async () => {
    const { correct } = await parsePostAnswerResponse(gaveAnswerTooRecently);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: gave answer too recently (with remaining time).', async () => {
    const { message } = await parsePostAnswerResponse(gaveAnswerTooRecently);
    expect(message).toMatch(
      /You gave an answer too recently; you have to wait after submitting an answer before trying again. You have [\w\d]+ left to wait./
    );
  });

  test('returns expected message if response: gave answer too recently (without remaining time).', async () => {
    const { message } = await parsePostAnswerResponse(
      gaveAnswerTooRecently.replace('You have 16s left to wait.', '')
    );
    expect(message).toMatch(
      /You gave an answer too recently; you have to wait after submitting an answer before trying again./
    );
  });
});
