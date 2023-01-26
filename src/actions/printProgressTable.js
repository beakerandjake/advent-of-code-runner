/**
 * Outputs the progress table to the command line.
 */
export const printProgressTable = async ({ progressTable } = {}) => {
  if (!progressTable) {
    throw new Error('null or undefined progressTable');
  }

  /* istanbul ignore next */
  console.log(progressTable);
};
