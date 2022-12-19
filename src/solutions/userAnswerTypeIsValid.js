/**
 * Validates the the user solution function returned a valid type
 * @param {Any} answer
 */
export const userAnswerTypeIsValid = (answer) => (
  Number.isFinite(answer) || (typeof answer === 'string' || answer instanceof String)
);
