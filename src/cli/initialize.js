import { confirm, password, select } from '@inquirer/prompts';
import ora from 'ora';
import { getConfigValue } from '../config.js';
import { festiveStyle } from '../festive.js';
import {
  createDataFile,
  createDotEnv,
  createGitIgnore,
  createPackageJson,
  createReadme,
  createSolutionFiles,
  cwdIsEmpty,
  deleteExistingInputFiles,
  installPackages,
} from '../initialize/index.js';
import { logger } from '../logger.js';
import { authTokenPrompt } from './auth.js';

/**
 * prompt for an inquirer confirm to confirm the operation.
 */
const confirmPrompt = {
  message: festiveStyle(
    'This directory is not empty! This operation will overwrite files, do you want to continue?'
  ),
  default: false,
};

/**
 * prompt for an inquirer select to choose the year.
 */
const yearPrompt = {
  // if list of years becomes too large change to raw input.
  message: festiveStyle('What year of advent of code are you doing?'),
  choices: [...getConfigValue('aoc.validation.years')]
    .reverse()
    .map((year) => ({ value: year })),
  loop: false,
};

/**
 * Ensures package.json is created before installing npm packages.
 */
const npmInit = async (year) => {
  await createPackageJson(year);
  await installPackages();
};

/**
 * Scaffolds a new project in the directory.
 */
export const initializeAction = async () => {
  // confirm action with user if cwd is not empty.
  if (!(await cwdIsEmpty()) && !(await confirm(confirmPrompt))) {
    logger.debug('user did not confirm the init action');
    return;
  }

  const year = await select(yearPrompt);
  if (!year) {
    throw new Error('select prompt returned empty year');
  }
  const token = await password(authTokenPrompt);
  if (!token) {
    throw new Error('select prompt returned empty token');
  }

  const spinner = ora({ spinner: 'christmas' });
  try {
    spinner.start(festiveStyle('The elves are getting the place ready...'));
    await Promise.all([
      npmInit(year),
      deleteExistingInputFiles(),
      createDataFile(year),
      createDotEnv(token),
      createGitIgnore(),
      createReadme(year),
      createSolutionFiles(year),
    ]);
    spinner.succeed(
      festiveStyle(
        'Successfully initialized your repository, have fun! (see README for help)'
      )
    );
  } catch (error) {
    spinner.fail();
    throw error;
  }
};

// /**
//  * inquirer.js question which makes the user confirm the initialize operation.
//  */
// const confirmQuestion = {
//   type: 'confirm',
//   message: festiveStyle(
//     'This directory is not empty! This operation will overwrite files, do you want to continue?'
//   ),
//   default: false,
// };

// const initializeQuestions = {
//   year: {
//     // in future if list of years becomes too large the change to raw input.
//     type: 'select',
//     message: festiveStyle('What year of advent of code are you doing?'),
//     choices: [...getConfigValue('aoc.validation.years')]
//       .reverse()
//       .map((year) => ({ value: year })),
//     loop: false,
//   },
//   authToken: authTokenQuestion,
// };

// /**
//  * A Link which creates all required files in the cwd.
//  */
// const createFiles = async ({ answers }) => {
//   await Promise.all([
//     deleteExistingInputFiles(),
//     createDataFile(answers),
//     createDotEnv(answers),
//     createGitIgnore(answers),
//     createPackageJson(answers),
//     createReadme(answers),
//     createSolutionFiles(answers),
//   ]);
// };

// /**
//  * The action that is invoked by commander.
//  * @private
//  */
// export const initializeAction = async () => {
//   // if there are files in the cwd, get confirmation with the user that they want to proceed.
//   if (!(await cwdIsEmpty()) && !(await assertUserConfirmation({ confirmQuestion }))) {
//     return;
//   }

//   // get all the info we need in order to initialize.
//   const answers = await getAnswersFromUser({ questions: initializeQuestions });

//   // run initialize steps in an action chain that reports its progress to the user.
//   const actionChain = createChainWithProgress(
//     [
//       { fn: createFiles, message: 'Creating files...' },
//       { fn: installPackages, message: 'Installing Packages...' },
//     ],
//     'Successfully initialized your repository, have fun! (see README for help)'
//   );

//   await actionChain({ answers });
// };
