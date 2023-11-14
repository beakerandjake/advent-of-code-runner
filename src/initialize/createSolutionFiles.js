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
 * Create a solution template for each day.
 * @param {String} template
 * @param {Number[]} days
 * @returns {Array<Promise>}
 */
const doCreate = (template, year, days) =>
  days.map((day) =>
    writeFile(
      getSolutionFileName(day),
      replaceTokens(tokens, { year, day }, template),
      'utf-8'
    )
  );

/**
 * Creates the solution files in the cwd.
 */
export const createSolutionFiles = async (year) => {
  logger.debug('creating Solution files');

  if (year == null) {
    throw new Error('null or undefined year');
  }

  // create solution dir if does not already exist.
  await ensureDir(getConfigValue('paths.solutionsDir'));

  // load the template files (last day is special and needs a different template than default)
  const [basicTemplate, lastDayTemplate] = await Promise.all([
    readFile(getConfigValue('paths.templates.solutionDefault'), 'utf8'),
    readFile(getConfigValue('paths.templates.solutionLastDay'), 'utf8'),
  ]);

  return Promise.all([
    // all days but the last day share a default solution template.
    ...doCreate(
      basicTemplate,
      year,
      getConfigValue('aoc.validation.days').slice(0, -1)
    ),
    // last day is special and needs a different solution template.
    ...doCreate(
      lastDayTemplate,
      year,
      getConfigValue('aoc.validation.days').slice(-1)
    ),
  ]);
};
