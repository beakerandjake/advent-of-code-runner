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
 *
 * @param {String} templateFilePath
 * @param {Number[]} days
 * @returns {Array<Promise>}
 */
const doCreate = async (templateFilePath, year, days) => {
  const template = await readFile(templateFilePath, { encoding: 'utf-8' });
  return days.map((day) =>
    writeFile(
      getSolutionFileName(day),
      replaceTokens(tokens, { year, day }, template),
      'utf-8'
    )
  );
};

/**
 * Creates the solution files in the cwd.
 */
export const createSolutionFiles = async ({ year } = {}) => {
  logger.debug('creating Solution files');

  if (year == null) {
    throw new Error('null or undefined year');
  }

  await ensureDir(getConfigValue('paths.solutionsDir'));

  await Promise.all([
    // all days but the last day share a default solution template.
    ...doCreate(
      getConfigValue('paths.templates.solutionDefault'),
      year,
      getConfigValue('aoc.validation.days').slice(0, -1)
    ),
    // last day is special and needs a different solution template.
    ...doCreate(
      getConfigValue('paths.templates.solutionLastDay'),
      year,
      getConfigValue('aoc.validation.days').slice(-1)
    ),
  ]);
};
