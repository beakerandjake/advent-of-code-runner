import { confirm, select, password } from '@inquirer/prompts';

/**
 * Prompt the user with an inquirer question.
 */
const prompt = (type, args) => {
  switch (type) {
    case 'confirm':
      return confirm(args);
    case 'select':
      return select(args);
    case 'password':
      return password(args);
    default:
      throw new Error(`unsupported question type: ${type}`);
  }
};

/**
 * Creates a link which, when invoked will ask the user the specified questions.
 * The link will add the user answers to the args.
 * @param {Object} questions - The inquirer.js questions to ask the user
 */
export const getAnswersFromUser = async ({ questions } = {}) => {
  if (!questions) {
    throw new Error('null or undefined question');
  }
  const answers = {};
  for (const [key, { type, ...args }] of Object.entries(questions)) {
    // eslint-disable-next-line no-await-in-loop
    answers[key] = await prompt(type, args);
  }
  return answers;
};
