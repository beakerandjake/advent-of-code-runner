/**
 * Error that is raised when the user data file is not properly formatted JSON.
 */
export class DataFileParsingError extends Error {
  constructor(fileName, ...args) {
    super(`Could not parse JSON in user data file at: "${fileName}". This shouldn't normally happen, did you manually edit this file?`, ...args);
    this.name = 'DataFileParsingError';
  }
}
