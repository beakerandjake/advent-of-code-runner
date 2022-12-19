import { DataFileIOError } from './dataFileIOError.js';
import { DataFileParsingError } from './dataFileParsingError.js';
import { LockedOrCompletedPuzzleError } from './lockedOrCompletedPuzzleError.js';
import { LockedPuzzleError } from './lockedPuzzleError.js';
import { PackageInstallFailedError } from './packageInstallFailedError.js';
import { PuzzleAlreadySolvedError } from './puzzleAlreadySolvedError.js';
import { RateLimitExceededError } from './rateLimitExceededError.js';
import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionThrewError,
} from './solutionWorkerErrors.js';
import { UserDataTranslationError } from './userDataTranslationError.js';
import { UserError } from './userError.js';
import { UserPuzzleDataMissingError } from './userPuzzleDataMissingError.js';
import { InvalidYearError } from './validationErrors.js';

export {
  DataFileIOError,
  DataFileParsingError,
  LockedOrCompletedPuzzleError,
  LockedPuzzleError,
  PuzzleAlreadySolvedError,
  RateLimitExceededError,
  PackageInstallFailedError,
  UserDataTranslationError,
  UserPuzzleDataMissingError,
  UserError,

  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionThrewError,
  InvalidYearError,
};
