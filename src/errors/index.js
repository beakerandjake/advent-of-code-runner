import { DataFileIOError } from './dataFileIOError.js';
import { DataFileParsingError } from './dataFileParsingError.js';
import { LockedOrCompletedPuzzleError } from './lockedOrCompletedPuzzleError.js';
import { PackageInstallFailedError } from './packageInstallFailedError.js';
import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionSyntaxError,
  UserSolutionThrewError,
} from './solutionWorkerErrors.js';
import { UserDataTranslationError } from './userDataTranslationError.js';
import { UserError } from './userError.js';
import { UserPuzzleDataMissingError } from './userPuzzleDataMissingError.js';
import { PuzzleHasBeenSolvedError, DuplicateAnswerSubmittedError } from './submissionErrors.js';
import { RateLimitExceededError, SolvingWrongLevelError } from './apiErrors.js';

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
  UserSolutionSyntaxError,
  UserSolutionThrewError,

  PuzzleHasBeenSolvedError,
  DuplicateAnswerSubmittedError,
  SolvingWrongLevelError,
};
