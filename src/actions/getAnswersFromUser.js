import inquirer from 'inquirer';

/**
 * Creates a link which, when invoked will ask the user the specified questions.
 * The link will add the user answers to the args.
 * @param {Object[]} questions - The inquirer.js questions to ask the user
 */
export const getAnswersFromUser = (questions = []) => {
  if (questions == null) {
    throw new Error('null or undefined question');
  }

  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    getAnswersFromUser: async () => ({
      answers: await inquirer.prompt(questions),
    }),
  };

  return _.getAnswersFromUser;
};
