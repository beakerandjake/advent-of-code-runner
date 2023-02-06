import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
const mockPrompt = jest.fn();
jest.unstable_mockModule('inquirer', () => ({
  default: {
    prompt: mockPrompt,
  },
}));

// import after setting up mocks
const { getAnswersFromUser } = await import(
  '../../src/actions/getAnswersFromUser.js'
);

describe('getAnswersFromUser()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws if questions is null', () => {
    expect(() => getAnswersFromUser(null)).toThrow();
  });

  test('builds and returns link', () => {
    const result = getAnswersFromUser({});
    expect(result).toBeInstanceOf(Function);
  });

  test('returned link returns answers', async () => {
    const expected = { one: true, two: false };
    mockPrompt.mockResolvedValue(expected);
    const fn = getAnswersFromUser({});
    const result = await fn();
    expect(result).toEqual({ answers: expected });
  });
});
