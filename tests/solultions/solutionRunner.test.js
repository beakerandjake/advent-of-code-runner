import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockLogger } from '../mockLogger.js';

// setup mocks.
mockLogger();

// jest.unstable_mockModule('../../src/config.js', () => ({
//   getConfigValue: jest.fn(),
// }));

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
const { executeUserSolution } = await import('../../src/solutions/executeUserSolution');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('executeUserSolution', () => {
  describe('')
});
