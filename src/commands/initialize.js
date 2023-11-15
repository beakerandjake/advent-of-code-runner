import { confirm, password, select } from '@inquirer/prompts';
import ora from 'ora';
import { getConfigValue } from '../config.js';
import { festiveStyle } from '../festive.js';
import { createDataFile } from '../initialize/createDataFile.js';
import { createDotEnv } from '../initialize/createDotEnv.js';
import { createGitIgnore } from '../initialize/createGitIgnore.js';
import { createPackageJson } from '../initialize/createPackageJson.js';
import { createReadme } from '../initialize/createReadme.js';
import { createSolutionFiles } from '../initialize/createSolutionFiles.js';
import { cwdIsEmpty } from '../initialize/cwdIsEmpty.js';
import { deleteExistingInputFiles } from '../initialize/deleteExistingInputFiles.js';
import { installPackages } from '../initialize/installPackages.js';
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
 * Prompt the user for the information required to scaffold.
 */
const getUserAnswers = async () => {
  logger.debug('asking user to select the year');
  const year = await select(yearPrompt);
  if (!year) {
    throw new Error('select prompt returned empty year');
  }
  logger.debug('user selected: %s', year);
  logger.debug('asking user for token');
  const token = await password(authTokenPrompt);
  if (!token) {
    throw new Error('select prompt returned empty token');
  }
  return { year, token };
};

/**
 * Ensures package.json is created before installing npm packages.
 */
const npmInit = async (year) => {
  await createPackageJson(year);
  await installPackages();
};

/**
 * Wrap the execution of the function in an ora spinner to report its progress.
 */
const wrapInSpinner = async (fn) => {
  const spinner = ora({ spinner: 'christmas' });
  try {
    logger.debug('scaffolding directory');
    spinner.start(festiveStyle('The elves are getting the place ready...'));
    await fn();
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

/**
 * Scaffolds a new project in the directory.
 */
export const initializeAction = async () => {
  logger.debug('starting init action');

  // confirm action with user if cwd is not empty.
  if (!(await cwdIsEmpty()) && !(await confirm(confirmPrompt))) {
    logger.debug('user did not confirm the init action');
    return;
  }
  const { year, token } = await getUserAnswers();
  await wrapInSpinner(async () =>
    Promise.all([
      npmInit(year),
      deleteExistingInputFiles(),
      createDataFile(year),
      createDotEnv(token),
      createGitIgnore(),
      createReadme(year),
      createSolutionFiles(year),
    ])
  );
};
