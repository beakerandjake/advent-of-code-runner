import { getConfigValue } from '../config.js';
import { replaceTokens } from './replaceTokens.js';
import { loadFileContents, saveFile } from '../persistence/io.js';
import { logger } from '../logger.js';

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

  const { source, dest } = getConfigValue('paths.templates.dataStoreFile');

  const dataFile = replaceTokens(
    tokens,
    { version: getConfigValue('meta.version'), year },
    await loadFileContents(source),
  );

  logger.debug('copying template data store file from: %s to: %s', source, dest);

  await saveFile(dest, dataFile);
};
