import { DataFileIOError } from './dataFileIOError.js';
import { DataFileParsingError } from './dataFileParsingError.js';
import { LockedOrCompletedPuzzleError } from './lockedOrCompletedPuzzleError.js';
import { PackageInstallFailedError } from './packageInstallFailedError.js';
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
import { PuzzleHasBeenSolvedError, DuplicateAnswerSubmittedError } from './submissionErrors.js';

export {
  DataFileIOError,
  DataFileParsingError,
  LockedOrCompletedPuzzleError,
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

  PuzzleHasBeenSolvedError,
  DuplicateAnswerSubmittedError,
};
