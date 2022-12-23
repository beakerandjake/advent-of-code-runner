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

/**
 * We basically just need to run 'getNextUnsolvedPuzzle' at the start of the regular solve chain.
 * But to run 'getNextUnsolvedPuzzle' we need 'getYear', and the solve chain already has that.
 * It wouldn't be the end of the world to run 'getYear' twice, it's idempotent....
 * But there's no reason to if we don't have to, so just yank it off the front of the solve chain.
 * Add our required actions then concat the modified solve chain and we're golden.
 */
const actionChain = createChain([
  getYear,
]);

/**
 * Performs first time setup, scaffolds the cwd with all of the files required to run this cli.
 */
export const initialize = () => actionChain({});
