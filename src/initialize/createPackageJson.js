// import { basename } from 'node:path';
// import { outputFile } from 'fs-extra/esm';
// import { readFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
// import { replaceTokens } from './replaceTokens.js';

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
 */
// export const createPackageJson = async ({ year }) => {
//   logger.debug('creating package.json file');
//   // might be better to run npm init in a child_process
//   // but to keep it simple just copy the template
//   const { source, dest } = getConfigValue('paths.templates.packageJson');
//   const templatePackageJson = await readFile(source, { encoding: 'utf-8' });
//   const packageJson = replaceTokens(
//     envFileTokens,
//     {
//       year,
//       version: getConfigValue('meta.version'),
//       theirPackageName: basename(getConfigValue('cwd')),
//       ourPackageName: basename(getConfigValue('meta.name')),
//     },
//     templatePackageJson,
//   );
//   logger.debug('saving package.json file to: %s', dest);
//   await outputFile(dest, packageJson);
// };

const execNpmInit = async () => new Promise((resolve, reject) => {
  exec('npm init -y', { cwd: getConfigValue('cwd') }, (error) => {
    if (error) {
      reject(new Error(`Failed to run npm init, exit code: ${error.code}`, { cause: error }));
    } else {
      resolve();
    }
  });
});

export const createPackageJson = async ({ year } = {}) => {
  logger.debug('creating package.json file');

  if (year == null) {
    throw new Error('null or undefined year');
  }

  await execNpmInit();
};
