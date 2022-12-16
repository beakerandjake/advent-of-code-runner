import { UserError } from './userError.js';

/**
 * Error that is raised when an entry for the puzzle is missing from the users data file.
 */
export class UserPuzzleDataMissingError extends UserError {
  constructor(year, day, part) {
    super(`Could not find puzzle for year: ${year}, day: ${day}, part: ${part} in user data file.`);
    this.name = 'UserPuzzleDataMissingError';
  }
}
