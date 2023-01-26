import { createChain } from './actionChain.js';
import { assertConfigValue } from './assertConfigValue.js';
import { generateMarkdownProgressTable } from './generateMarkdownProgressTable.js';
import { getCompletionData } from './getCompletionData.js';
import { saveProgressTableToReadme } from './saveProgressTableToReadme.js';
import { not } from './logical.js';

/**
 * Updates the users README with the progress table unless feature is disabled in config.
 */
export const tryToUpdateReadmeWithProgressTable = async (args) => {
  // this is a special action which runs its own action chain
  // expecting this action to be run in a parent chain.
  // because of this we will "swallow" our chains return value
  // that way we do not halt the parent chain if our chain halts.
  // exceptions however will still be bubbled up.

  const action = createChain([
    // halt our chain if the auto save feature is disabled
    not(assertConfigValue('disableReadmeAutoSaveProgress')),
    getCompletionData,
    generateMarkdownProgressTable,
    saveProgressTableToReadme,
  ]);

  await action({ ...args });
};
