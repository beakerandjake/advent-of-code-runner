/**
 * Error that is raised if the user has misconfigured the year in their .env file.
 */
export class InvalidYearError extends Error {
  constructor(year, ...args) {
    super(`The year: ${year} is invalid, check your .env file to ensure you have specified a valid year.`, ...args);
    this.name = InvalidYearError;
  }
}

/**
 * Error that is raised if the user attempts a puzzle which is in the future.
 */
export class PuzzleIsLockedError extends Error {
  constructor(day, part, ...args) {
    super(`You cannot attempt this puzzle (day ${day}, part ${part}) because it is in the future and has not unlocked.`, ...args);
    this.name = 'PuzzleIsLockedError';
  }
}

/**
 * Error that is raised if the user attempts a part of puzzle
 * when they haven't completed the requisite part.
 */
export class PuzzlePartIsLockedError extends Error {
  constructor(day, part, ...args) {
    super(`You cannot attempt this puzzle (day ${day}, part ${part}) because you have not completed the previously required part.`, ...args);
    this.name = 'PuzzlePartIsLockedError';
  }
}
