import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';
import {
  answerTooHigh,
  answerTooLow,
  badLevel,
  correctAnswerDayComplete,
  correctAnswerDayIncomplete,
  doesNotMatch,
  gaveAnswerTooRecently,
  notTheRightAnswer,
} from './getActualResponseHtml.js';
import { SolvingWrongLevelError } from '../../src/errors/apiErrors.js';

// setup mocks
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
    await expect(() => parsePostAnswerResponse(doesNotMatch)).rejects.toThrow();
  });

  test('throws if response: incorrect, solving wrong level', async () => {
    await expect(() => parsePostAnswerResponse(badLevel)).rejects.toThrow(
      SolvingWrongLevelError
    );
  });

  test('throws if response: gave answer too recently (without remaining time).', async () => {
    await expect(() =>
      parsePostAnswerResponse(gaveAnswerTooRecently)
    ).rejects.toThrow(
      /You gave an answer too recently; you have to wait after submitting an answer before trying again./
    );
  });

  test('throws if response: gave answer too recently (with remaining time).', async () => {
    await expect(() =>
      parsePostAnswerResponse(
        gaveAnswerTooRecently.replace('You have 16s left to wait.', '')
      )
    ).rejects.toThrow(
      /You gave an answer too recently; you have to wait after submitting an answer before trying again./
    );
  });

  test('returns correct if response success, day incomplete', async () => {
    const { correct } = await parsePostAnswerResponse(
      correctAnswerDayIncomplete
    );
    expect(correct).toBe(true);
  });

  test('returns expected message if response: success, day incomplete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayIncomplete
    );
    expect(message).toBe(
      "That's the right answer! You are one gold star closer to collecting enough star fruit."
    );
  });

  test('returns correct if response: success, day complete', async () => {
    const { correct } = await parsePostAnswerResponse(correctAnswerDayComplete);
    expect(correct).toBe(true);
  });

  test('returns expected message if response: success, day complete', async () => {
    const { message } = await parsePostAnswerResponse(correctAnswerDayComplete);
    expect(message).toMatch(
      /That's the right answer! You are one gold star closer to collecting enough star fruit. You have completed Day \d+!/
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

  test('returns incorrect if response: answer too low.', async () => {
    const { correct } = await parsePostAnswerResponse(answerTooLow);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: answer too low.', async () => {
    const { message } = await parsePostAnswerResponse(answerTooLow);
    expect(message).toBe(
      "That's not the right answer; your answer is too low."
    );
  });

  test('returns incorrect if response: answer too high.', async () => {
    const { correct } = await parsePostAnswerResponse(answerTooHigh);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: answer too high.', async () => {
    const { message } = await parsePostAnswerResponse(answerTooHigh);
    expect(message).toBe(
      "That's not the right answer; your answer is too high."
    );
  });
});
