import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();
mockConfig();

// jest.unstable_mockModule('../../src/api/index.js', () => ({
//   downloadInput: jest.fn(),
// }));

// jest.unstable_mockModule('../../src/inputs/inputCache.js', () => ({
//   inputIsCached: jest.fn(),
//   getCachedInput: jest.fn(),
//   cacheInput: jest.fn(),
// }));

// const { downloadInput } = await import('../../src/api/index.js');
// const { inputIsCached, getCachedInput, cacheInput } = await import('../../src/inputs/inputCache.js');

const { Worker } = await import('node:worker_threads');
const { getConfigValue } = await import('../../src/config.js');
const { fileExists } = await import('../../src/persistence/io.js');
const { execute } = await import('../../src/solutions/solutionRunner.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('executeUserSolution', () => {
  test.todo('lots to do');
});
