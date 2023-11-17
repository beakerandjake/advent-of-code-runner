import { logger } from '../logger.js';
import { ParsePostAnswerResponseError } from '../errors/apiErrors.js';

/**
 * Returns a parser which matches an "answer too low" response.
 */
const answerTooLow = () => [
  (response) =>
    /that's not the right answer/im.test(response) &&
    /answer is too low/im.test(response),
  false,
  () => "That's not the right answer; your answer is too low.",
];

/**
 * Returns a parser which matches an "answer too high" response.
 */
const answerTooHigh = () => [
  (response) =>
    /that's not the right answer/im.test(response) &&
    /answer is too high/im.test(response),
  false,
  () => "That's not the right answer; your answer is too high.",
];

/**
 * Returns a parser which matches a "not the right answer" response.
 */
const notTheRightAnswer = () => [
  (response) => /that's not the right answer/im.test(response),
  false,
  () => "That's not the right answer.",
];

/**
 * Returns a parser which matches a "answered too recently" response.
 */
const answeredTooRecently = () => [
  (response) => /answer too recently/im.test(response),
  false,
  (response) => {
    let message =
      'You gave an answer too recently; you have to wait after submitting an answer before trying again.';
    const matchRemaining = response.match(/you have ([\w\d]+) left to wait./i);
    if (matchRemaining) {
      message += ` You have ${matchRemaining[1]} left to wait.`;
    }
    return message;
  },
];

/**
 * Returns a parser which matches a not 'solving at the right level' response.
 */
const incorrectLevel = () => [
  (response) => /solving the right level/im.test(response),
  false,
  () =>
    "You don't seem to be solving the right level. Did you already complete it?",
];

/**
 * Returns a parser which matches a not 'that's the right answer' response.
 */
const correctAnswer = () => {
  const matcher = (response) => /that's the right answer/im.test(response);
  const getMessage = (response) => {
    const message = [
      "That's the right answer!",
      'You are one gold star closer to collecting enough start fruit.',
    ];
    // Add completion message if user completed all levels for the day.
    const dayComplete = response.match(/you have completed day (\d+)!/i);
    if (dayComplete) {
      message.push(`You have completed Day ${dayComplete[1]}!`);
    }
    return message.join(' ');
  };
  return [matcher, true, getMessage];
};

const parsers = [
  incorrectLevel(),
  answeredTooRecently(),
  answerTooLow(),
  answerTooHigh(),
  notTheRightAnswer(),
  correctAnswer(),
];

/**
 * Parses the raw html response from the html and returns the result of the submission.
 * @param {string} response - The html that the server responded with.
 * @returns {Promise<{correct:boolean,message:string}>}
 */
export const parsePostAnswerResponse = async (response) => {
  for (const [matchFn, correct, messageFn] of parsers) {
    if (matchFn(response)) {
      return { correct, message: messageFn(response) };
    }
  }
  throw new ParsePostAnswerResponseError(response);
};
