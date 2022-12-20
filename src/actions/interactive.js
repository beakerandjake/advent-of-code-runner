import inquirer from 'inquirer';

/**
 * Prompt the user with the specific question and make them confirm.
 * @param {Object} question
 */
export const confirmWithUser = async (question) => {
  const { confirm } = await inquirer.prompt({ ...question, type: 'confirm' });
  return confirm;
};

/**
 * Prompt the user with the specific questions and return the answers.
 * @param {Object[]} questions
 */
export const getAnswersFromUser = async (questions) => inquirer.prompt(questions);
