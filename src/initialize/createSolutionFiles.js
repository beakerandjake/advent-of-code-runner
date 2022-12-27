import { join } from 'node:path';
import { getConfigValue } from '../config.js';
import {
  ensureDirectoriesExist, loadFileContents, saveFile,
} from '../persistence/io.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

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
export const createSolutionFiles = async ({ year }) => {
  logger.debug('creating Solution files');

  // create directory if doesn't exist.
  const solutionsDir = getConfigValue('paths.solutionsDir');
  await ensureDirectoriesExist(solutionsDir);

  // load the contents of the template solution
  const templateSolutionFile = await loadFileContents(
    getConfigValue('paths.templates.solution'),
  );

  // create each template solution file.
  const createFilePromises = getConfigValue('aoc.validation.days').map(
    (day) => saveFile(
      join(solutionsDir, `day_${day}.js`),
      replaceTokens(tokens, { year, day }, templateSolutionFile),
    ),
  );

  await Promise.all(createFilePromises);
};
