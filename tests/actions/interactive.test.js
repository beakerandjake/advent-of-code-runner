import {
  describe, jest, test, beforeEach,
} from '@jest/globals';

const mockPrompt = jest.fn();
jest.unstable_mockModule('inquirer', () => ({
  default: ({
    prompt: mockPrompt,
  }),
}));

const { confirmWithUser, getAnswersFromUser } = await import('../../src/actions/interactive.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('interactive', () => {
  describe('confirmWithUser()', () => {
    test('returns true if user confirms', async () => {
      mockPrompt.mockResolvedValue({ confirm: true });
      const result = await confirmWithUser({});
      expect(result).toBe(true);
    });
    test('returns false is user does not confirm', async () => {
      mockPrompt.mockResolvedValue({ confirm: false });
      const result = await confirmWithUser({});
      expect(result).toBe(false);
    });
  });

  describe('getAnswersFromUser()', () => {
    test('returns answers', async () => {
      const expected = { one: true, two: false };
      mockPrompt.mockResolvedValue(expected);
      const answers = await getAnswersFromUser([]);
      expect(answers).toEqual(expected);
    });
  });
});
