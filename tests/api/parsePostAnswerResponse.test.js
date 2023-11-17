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
      "That's the right answer! You are one gold star closer to collecting enough start fruit."
    );
  });

  test('returns correct if response: success, day complete', async () => {
    const { correct } = await parsePostAnswerResponse(
      correctAnswerDayComplete
    );
    expect(correct).toBe(true);
  });

  test('returns expected message if response: success, day complete', async () => {
    const { message } = await parsePostAnswerResponse(
      correctAnswerDayComplete
    );
    expect(message).toMatch(
      /That's the right answer! You are one gold star closer to collecting enough start fruit. You have completed Day \d+!/
    );
  });

  test('returns incorrect if response: incorrect, solving wrong level', async () => {
    const { correct } = await parsePostAnswerResponse(badLevel);
    expect(correct).toBe(false);
  });

  test('returns expected message if response: incorrect, solving wrong level', async () => {
    const { message } = await parsePostAnswerResponse(badLevel);
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
