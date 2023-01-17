import { pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { getPuzzleCompletionData } from '../statistics.js';

/**
 * Generates a markdown table from the years data.
 */
const generateTable = async (year, completionData) => {
  const headerRows = [
    ['Puzzle', 'Solved', 'Attempts', 'Runtime'],
    ['---', '---', '---', '---'],
  ];

  return '';
};

/**
 * Saves a table to the users readme which shows the users progress for the year.
 */
export const saveCompletionTableToReadme = async ({ year } = {}) => {
  if (year == null) {
    throw new Error('null or undefined year');
  }

  const completionData = await getPuzzleCompletionData(year);

  if (completionData.length === 0) {
    logger.festive('You have not submitted any puzzles yet, please run this command after submitting a puzzle');
    return false;
  }

  const tableText = await generateTable(year, completionData);

  console.log(tableText);
  return true;
};
