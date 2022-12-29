import { outputFile } from 'fs-extra/esm';
import { readFile } from 'node:fs/promises';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';
import { replaceTokens } from './replaceTokens.js';

/**
 * Maps tokens strings in the template env file to fields of the args.
 */
const tokens = [
  { match: '{{version}}', key: 'version' },
  { match: '{{year}}', key: 'year' },
];

/**
 * Creates a aocr-data.json file in the cwd.
 */
export const createDataFile = async ({ year }) => {
  logger.debug('creating data file');
  const { source, dest } = getConfigValue('paths.templates.userDataFile');
  const templateFileContents = await readFile(source, { encoding: 'utf-8' });

  // replace the tokens in the template file.
  const dataFileContents = replaceTokens(
    tokens,
    { version: getConfigValue('meta.version'), year },
    templateFileContents,
  );

  logger.debug('saving data file to: %s', dest);
  await outputFile(dest, dataFileContents);
};
