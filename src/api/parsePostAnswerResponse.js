import { ParsePostAnswerResponseError } from '../errors/apiErrors.js';

/**
 * Returns a parser which matches an "answer too low" response.
 */
const answerTooLow = () => {
  const matcher = (response) => {};
  return [matcher, false, () => 'Answer was too low'];
};

/**
 * Returns a parser which matches an "answer too high" response.
 */
const answerTooHigh = () => {
  const matcher = (response) => {};
  return [matcher, false, () => 'Answer was too high.'];
};

/**
 * Returns a parser which matches a "not the right answer" response.
 */
const notTheRightAnswer = () => {
  const matcher = (response) => {};
  return [matcher, false, () => ''];
};

/**
 * Returns a parser which matches a "answered too recently" response.
 */
const answeredTooRecently = () => {
  const matcher = (response) => {};
  return [matcher, false, () => ''];
};

/**
 * Returns a parser which matches a not 'solving at the right level' response.
 */
const incorrectLevel = () => {
  const matcher = (response) => {};
  return [matcher, false, () => ''];
};

/**
 * Returns a parser which matches a not 'solving at the right level' response.
 */
const correctAnswer = () => {
  const matcher = (response) => {};
  return [matcher, false, () => ''];
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
  // TODO, write out response html to a temp folder and update message
  throw new ParsePostAnswerResponseError();
};
