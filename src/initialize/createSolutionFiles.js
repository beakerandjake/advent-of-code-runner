import { join } from 'path';
import { getConfigValue } from '../config.js';
import { copyFile, ensureDirectoriesExist } from '../io.js';
import { logger } from '../logger.js';

/**
 * Creates the solution files in the cwd.
 */
export const createSolutionFiles = async () => {
  logger.debug('creating solution files');

  const solutionsDir = getConfigValue('paths.solutionsDir');

  await ensureDirectoriesExist(solutionsDir);

  const filePaths = getConfigValue('aoc.puzzleValidation.days').map(
    (day) => join(solutionsDir, `day_${day}.js`),
  );

  const templateSolutionFile = getConfigValue('paths.templates.solution');

  return Promise.all(
    filePaths.map((dest) => copyFile(templateSolutionFile, dest)),
  );
};
