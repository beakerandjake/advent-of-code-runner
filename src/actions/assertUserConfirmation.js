import inquirer from 'inquirer';

/**
 * Creates a link which when invoked will ask the user the specified question.
 * The link will return a boolean value based on if the user answered yes to the question.
 * @param {Object} question - The question passed to inquirer
 */
export const assertUserConfirmation = (question) => {
  if (question == null) {
    throw new Error('null or undefined question');
  }

  // create a variable for this fn instead of just returning the fn
  // this gives the fn a .name property and makes debugging easier.
  const _ = {
    assertUserConfirmation: async () => {
      const { confirmed } = await inquirer.prompt({ ...question, type: 'confirm' });
      return confirmed;
    },
  };
  return _.assertUserConfirmation;
};
