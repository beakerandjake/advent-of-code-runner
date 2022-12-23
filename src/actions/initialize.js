// import ora from 'ora';
// import { confirmWithUser, getAnswersFromUser } from './interactive.js';
// import { initializeQuestions, confirmOverwriteCwdQuestion } from './initializeQuestions.js';
// import { createFiles, cwdIsEmpty, installPackages } from '../initialize/index.js';
// import { festiveStyle, festiveEmoji } from '../festive.js';

// /**
//  * Scaffolds the cwd with all files required to use this cli.
//  */
// export const initialize = async () => {
//   // if there are files in the cwd, get confirmation with the user that they want to proceed.
//   if (!await cwdIsEmpty() && !await confirmWithUser(confirmOverwriteCwdQuestion)) {
//     return;
//   }

//   const answers = await getAnswersFromUser(initializeQuestions);
//   const spinner = ora({ text: festiveStyle('Creating files'), spinner: 'christmas' }).start();

//   try {
//     await createFiles(answers);
//     spinner.text = festiveStyle('Installing packages');
//     await installPackages();
//     spinner.stopAndPersist({
//       text: festiveStyle('Successfully initialized your repository, have fun!'),
//       symbol: festiveEmoji(),
//     });
//   } catch (error) {
//     spinner.fail();
//     throw error;
//   }
// };

import { getYear } from './links/index.js';
import { createChain } from './actionChain.js';

const spinnerDecorator = () => async (...args) => {
  // TODO create spinner, pass args to chain { updateProgressText: function }
  // on chain finish, stop and persist spinner
  // on chain fail, fail spinner and re-throw
};

const coolFn = (args) => {
  console.log('coolFn args:', args);
};

const coolFn2 = (...args) => {
  console.log('coolFn2 args:', args);
};

const coolFn3 = (...args) => {
  console.log('coolFn3 args:', ...args);
};

/**
 *
 */
const actionChain = createChain([
  getYear,
  // () => {
  //   const args = { cat: true, dog: false, cow: 'moo' };
  //   coolFn(args);
  //   coolFn2(args);
  //   coolFn3(args);
  // },
]);

/**
 * Performs first time setup, scaffolds the cwd with all of the files required to run this cli.
 */
export const initialize = () => actionChain({});
