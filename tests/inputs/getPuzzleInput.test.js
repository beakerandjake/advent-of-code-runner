import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import { InvalidPuzzleInputError } from '../../src/errors/puzzleErrors.js';

// setup mocks.
const easyMocks = [
  ['src/api/index.js', ['getInput']],
  [
    'src/inputs/inputCache.js',
    ['cacheInput', 'getCachedInput', 'inputIsCached'],
  ],
  ['src/validation/validateInput.js', ['inputIsValid']],
  ['src/persistence/metaRepository.js', ['getAuthToken']],
];
easyMock(easyMocks);
mockLogger();

// import after setting up mocks
const { getInput, cacheInput, getCachedInput, inputIsCached, inputIsValid } =
  await easyResolve(easyMocks);
const { getPuzzleInput } = await import('../../src/inputs/getPuzzleInput.js');

describe('getPuzzleInput()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('loads cached input if input is cached', async () => {
    inputIsCached.mockResolvedValue(true);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(getCachedInput).toHaveBeenCalled();
  });

  test('does not download input if input is cached', async () => {
    inputIsCached.mockResolvedValue(true);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(getInput).not.toHaveBeenCalled();
  });

  test('downloads input if input is not cached', async () => {
    inputIsCached.mockResolvedValue(false);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(getInput).toHaveBeenCalled();
  });

  test('downloads input if input is not cached', async () => {
    inputIsCached.mockResolvedValue(false);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(getInput).toHaveBeenCalled();
  });

  test('caches input if input is downloaded', async () => {
    inputIsCached.mockResolvedValue(false);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(cacheInput).toHaveBeenCalled();
  });

  test('does not cache input if download fails', async () => {
    inputIsCached.mockResolvedValue(false);
    getInput.mockRejectedValue(new Error());
    await expect(async () => getPuzzleInput(1, 2)).rejects.toThrow();
    expect(getInput).toHaveBeenCalled();
    expect(cacheInput).not.toHaveBeenCalled();
  });

  test('does not cache input if input is not downloaded', async () => {
    inputIsCached.mockResolvedValue(true);
    inputIsValid.mockReturnValue(true);
    await getPuzzleInput(1, 1);
    expect(cacheInput).not.toHaveBeenCalled();
  });

  test('throws if input is not valid', async () => {
    inputIsValid.mockReturnValue(false);
    await expect(() => getPuzzleInput(1, 1)).rejects.toThrow(
      InvalidPuzzleInputError
    );
  });
});
