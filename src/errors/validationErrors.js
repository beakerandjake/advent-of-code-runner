/**
 * Year that is raised if the user has misconfigured the year in their .env file.
 */
export class YearIsInvalidError extends Error {
  constructor(year, ...args) {
    super(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`, ...args);
    this.name = YearIsInvalidError;
  }
}
