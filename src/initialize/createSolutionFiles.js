import { ensureDir } from 'fs-extra/esm';
import { readFile, writeFile } from 'node:fs/promises';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';
import { getSolutionFileName } from '../solutions/solutionRunner.js';

/**
 * Maps tokens strings in the template project json file to fields of the args.
 */
const tokens = [
  { match: '{{day}}', key: 'day' },
  { match: '{{year}}', key: 'year' },
];

/**
 * Creates the solution files in the cwd.
 */
export const createSolutionFiles = async ({ year } = {}) => {
  logger.debug('creating Solution files');

  if (year == null) {
    throw new Error('null or undefined year');
  }

  // create directory if doesn't exist.
  const solutionsDir = getConfigValue('paths.solutionsDir');
  await ensureDir(solutionsDir);

  // load the contents of the template solution
  const templateSolutionFile = await readFile(
    getConfigValue('paths.templates.solution'),
    { encoding: 'utf-8' }
  );

  // create each template solution file.
  const createFilePromises = getConfigValue('aoc.validation.days').map((day) =>
    writeFile(
      getSolutionFileName(day),
      replaceTokens(tokens, { year, day }, templateSolutionFile),
      'utf-8'
    )
  );

  await Promise.all(createFilePromises);
};
