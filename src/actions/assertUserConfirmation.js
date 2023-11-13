import { confirm } from '@inquirer/prompts';

/**
 * Creates a link which when invoked will ask the user the specified question.
 * The link will return a boolean value based on if the user answered yes to the question.
 * @param {Object} confirmQuestion - The question passed to the confirm prompt
 * @param {string} confirmQuestion.message - The question to ask
 * @param {boolean} confirmQuestion.default - The default answer (true or false)
 */
export const assertUserConfirmation = async ({ confirmQuestion } = {}) => {
  if (!confirmQuestion || !confirmQuestion.message) {
    throw new Error('must specify a message');
  }
  return confirm(confirmQuestion);
};
