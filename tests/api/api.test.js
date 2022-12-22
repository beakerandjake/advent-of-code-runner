import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger, mockConfig } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('src/api/parseSubmissionResponse.js', () => ({
  extractTextContentOfMain: jest.fn(),
  sanitizeMessage: jest.fn(),
  parseResponseMessage: jest.fn(),
}));

// import after mocks are setup
const { extractTextContentOfMain, sanitizeMessage, parseResponseMessage } = await import('../../src/api/parseSubmissionResponse.js');
const { downloadInput, submitSolution } = await import('../../src/api/api.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('api', () => {
  describe('downloadInput()', () => {
    test('throws if no authentication token')
  });
});
