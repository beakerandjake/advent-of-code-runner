import ora from 'ora';
import { confirmWithUser, getAnswersFromUser } from './interactive.js';
import { initializeQuestions, confirmOverwriteCwdQuestion } from './initializeQuestions.js';
import { createFiles, cwdIsEmpty, installPackages } from '../initialize/index.js';
import { festiveStyle, festiveEmoji } from '../festive.js';

/**
 * Scaffolds the cwd with all files required to use this cli.
 */
export const initialize = async () => {
  // if there are files in the cwd, get confirmation with the user that they want to proceed.
  if (!await cwdIsEmpty() && !await confirmWithUser(confirmOverwriteCwdQuestion)) {
    return;
  }

  const answers = await getAnswersFromUser(initializeQuestions);
  const spinner = ora({ text: festiveStyle('Creating files'), spinner: 'christmas' }).start();

  try {
    await createFiles(answers);
    spinner.text = festiveStyle('Installing packages');
    await installPackages();
    spinner.stopAndPersist({
      text: festiveStyle('Successfully initialized your repository, have fun!'),
      symbol: festiveEmoji(),
    });
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
