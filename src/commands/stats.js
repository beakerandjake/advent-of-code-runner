import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import { logger } from '../logger.js';
import { getYear } from '../persistence/metaRepository.js';
import { getPuzzleCompletionData } from '../statistics.js';
import { markdownTable } from '../tables/markdownTable.js';
import { stdoutTable } from '../tables/stdoutTable.js';
import { updateReadmeProgress } from '../tables/updateReadmeProgress.js';
import { dataFileExists } from '../validation/userFilesExist.js';

/**
 * Saves the completion data to the README file.
 */
const saveToReadme = async (year, completionData) => {
  logger.debug('updating readme file due to --save option');
  const progressTable = await markdownTable(year, completionData);
  await updateReadmeProgress(progressTable);
  logger.festive('Saved progress to README file');
};

/**
 * Prints the completion data to stdout.
 */
const printToStdout = async (year, completionData) => {
  logger.debug('printing table to stdout due to lack of --save option');
  const progressTable = await stdoutTable(year, completionData);
  console.log(progressTable);
};

/**
 * Outputs the latest statistics of the years solved problems.
 * @param {Object} options
 * @param {boolean} options.save - If true the statistics will be saved to the readme file. If false they will be printed to the console.
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
      'No puzzles submitted, run this command after submitting at least puzzle'
    );
    return;
  }

  // save or print based on the option.
  await (save
    ? saveToReadme(year, completionData)
    : printToStdout(year, completionData));
};
