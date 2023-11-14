import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import { logger } from '../logger.js';
import { getYear } from '../persistence/metaRepository.js';
import { getPuzzleCompletionData } from '../statistics.js';
import { markdownTable } from '../stats/markdownTable.js';
import { stdoutTable } from '../stats/stdoutTable.js';
import { updateReadmeProgressTable } from '../stats/updateReadmeProgress.js';
import { dataFileExists } from '../validation/userFilesExist.js';

/**
 * Saves the completion data to the README file.
 */
const saveToReadme = async (year, completionData) => {
  logger.debug('updating readme file due to --save option');
  const progressTable = await markdownTable(year, completionData);
  return updateReadmeProgressTable(progressTable);
};

/**
 * Prints the completion data to stdout.
 */
const printToStdout = async (year, completionData) => {
  logger.debug('printing table to stdout due to lack of --save option');
  const progressTable = await stdoutTable(year, completionData);
  /* istanbul ignore next */
  console.log(progressTable);
};

/**
 * Command action to output the latest statistics.
 */
export const statsAction = async ({ save }) => {
  // bail if not initialized.
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }

  const year = await getYear();
  const completionData = await getPuzzleCompletionData(year);

  // bail if no puzzles completed
  if (!completionData?.length) {
    logger.festive(
      'no puzzles submitted, run this command after submitting at least puzzle'
    );
    return;
  }

  // save or print based on the option.
  await (save
    ? saveToReadme(year, completionData)
    : printToStdout(year, completionData));
};
