import { ParsePostAnswerResponseError } from '../errors/apiErrors.js';

const answerTooLow = () => {
  const matcher = (response) => {};
  return [matcher, false, () => 'Answer was too low'];
};

const parsers = [answerTooLow()];

export const parsePostAnswerResponse = async (response) => {
  for (const [matchFn, correct, messageFn] of parsers) {
    if (matchFn(response)) {
      return { correct, message: messageFn(response) };
    }
  }

  // If failed to match a parser then write out the full response
  // to a temporary html file on the users system.
  throw new ParsePostAnswerResponseError();
};
