import { basename } from 'node:path';
import { getConfigValue } from '../config.js';
import { loadFileContents, saveFile } from '../io.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template project json file to fields of the args.
 */
const envFileTokens = [
  { match: '{{theirPackageName}}', key: 'theirPackageName' },
  { match: '{{ourPackageName}}', key: 'ourPackageName' },
  { match: '{{year}}', key: 'year' },
  { match: '{{version}}', key: 'version' },
];

/**
 * Creates a package.json file in the cwd.
 * @param {Number} year
 */
export const createPackageJson = async (year) => {
  logger.debug('creating package.json file');

  // might be better to run npm init in a child_process
  // but to keep it simple just copy the template

  const args = {
    year,
    version: getConfigValue('meta.version'),
    theirPackageName: basename(getConfigValue('cwd')),
    ourPackageName: basename(getConfigValue('meta.name')),
  };

  const { source, dest } = getConfigValue('paths.templates.packageJson');

  // replace each token in the template package.json file with the arg values
  const packageJson = replaceTokens(
    envFileTokens,
    args,
    await loadFileContents(source),
  );

  logger.debug('saving package.json file to: %s', dest);

  return saveFile(dest, packageJson);
};
