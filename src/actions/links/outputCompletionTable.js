import { logger } from '../../logger.js';
import { getPuzzleCompletionData, summarizeCompletionData } from '../../statistics.js';
import { generateTable } from '../../tables/cliCompletionTable.js';

/**
 * Outputs a table to the cli which shows the users progress for the year.
 */
export const outputCompletionTable = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }
  const completionData = await getPuzzleCompletionData(year);

  if (completionData.length === 0) {
    logger.festive('You have not submitted any puzzles yet, please run this command after submitting a puzzle');
    return false;
  }

  const summaryData = summarizeCompletionData(completionData);
  const table = generateTable(year, completionData, summaryData);
  console.log(table);
  return true;
};
