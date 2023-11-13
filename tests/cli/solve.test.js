import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
const chainMock = jest.fn();
jest.unstable_mockModule('src/actions/actionChain.js', () => ({
  createChain: () => chainMock,
}));
jest.unstable_mockModule('src/actions/index.js', () => ({
  ifThen: jest.fn(),
}));

// import after mocks set up.
const { solveAction } = await import('../../src/cli/solve.js');

describe('solve command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('passes empty args if no day/level specified.', async () => {
    await solveAction();
    expect(chainMock).toHaveBeenCalledWith({});
  });

  test('passes args with level set to one if only day is specified.', async () => {
    const day = 10;
    await solveAction(day);
    expect(chainMock).toHaveBeenCalledWith({ day, level: 1 });
  });

  test('passes args with day and level if both are specified', async () => {
    const args = { day: 10, level: 5 };
    await solveAction(args.day, args.level);
    expect(chainMock).toHaveBeenCalledWith(args);
  });
});
