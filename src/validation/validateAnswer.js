/**
 * Validates that an answer provided by the users code is the correct type.
 * @param {Any} answer
 */
export const answerTypeIsValid = (answer) => {
  // handle null/undefined
  if (answer == null) {
    return false;
  }

  return Number.isFinite(answer) || (typeof answer === 'string' || answer instanceof String);
};
