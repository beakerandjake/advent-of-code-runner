import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
const mockPrompt = jest.fn();
jest.unstable_mockModule('inquirer', () => ({
  default: {
    prompt: mockPrompt,
  },
}));

// import after setting up mocks
const { assertUserConfirmation } = await import(
  '../../src/actions/assertUserConfirmation.js'
);

describe('assertUserConfirmation()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each([null, undefined])('throws if question is %s', (question) => {
    expect(() => assertUserConfirmation(question)).toThrow();
  });

  test('builds and returns function', () => {
    const result = assertUserConfirmation({});
    expect(result).toBeInstanceOf(Function);
  });

  test('returns true if user confirms', async () => {
    mockPrompt.mockResolvedValue({ confirmed: true });
    const fn = assertUserConfirmation({});
    const result = await fn();
    expect(result).toBe(true);
  });

  test('returns false if user does not confirm', async () => {
    mockPrompt.mockResolvedValue({ confirmed: false });
    const fn = assertUserConfirmation({});
    const result = await fn();
    expect(result).toBe(false);
  });
});
