import { pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { getPuzzleCompletionData } from '../statistics.js';
import { humanizeDuration } from '../formatting.js';



const td = (value) => `<td>${value}</td>`;
const th = (value, { colspan }) => `<th${colspan ? ` colspan=${colspan}` : ''}>${value}</th>`;
const tr = (values) => `<tr>${values.join('')}</tr>`;

/**
 * Generates the text for the name column.
 * @private
 */
export const mapNamedColumn = ({ day, level }) => `${day}.${level}`;

/**
 * Generates the text for the solved column.
 * @private
 */
export const mapSolvedColumn = ({ solved }) => (solved ? '✓' : '');

/**
 * Generates the text for the attempt column.
 * @private
 */
export const mapAttemptColumn = ({ numberOfAttempts }) => `${numberOfAttempts}`;

/**
 * Generates the text for the runtime column.
 * @private
 */
export const mapRuntimeColumn = ({ runtimeNs }) => {
  if (runtimeNs == null || runtimeNs === '') {
    return '';
  }

  return humanizeDuration(runtimeNs);
};

/**
 * Generates a markdown table from the years data.
 */
const generateTable = async (year, completionData) => {
  const names = completionData.map(mapNamedColumn);
  const solved = completionData.map(mapSolvedColumn);
  const attempts = completionData.map(mapAttemptColumn);
  const runtimes = completionData.map(mapRuntimeColumn);

  const headerRow = tr(['Puzzle', 'Solved', 'Attempts', 'Runtime'].map(th));
  const puzzleRows = completionData.map(
    (_, index) => tr([names[index], solved[index], attempts[index], runtimes[index]].map(td)),
  );
  const averageRow = tr([th('Average', { colspan: 2 }), td('asdf'), td('asdf')]);

  return [headerRow, ...puzzleRows, averageRow].join('');
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
