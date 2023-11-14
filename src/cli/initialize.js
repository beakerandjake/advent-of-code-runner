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
