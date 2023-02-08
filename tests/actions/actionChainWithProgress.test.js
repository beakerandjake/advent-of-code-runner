import { describe, jest, test, afterEach } from '@jest/globals';

// setup mocks
const oraMock = {
  text: null,
  isSpinning: false,
  start: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
  stop: jest.fn(),
};
jest.unstable_mockModule('ora', () => ({ default: () => oraMock }));
jest.unstable_mockModule('src/festive.js', () => ({
  festiveStyle: (value) => value,
}));
jest.unstable_mockModule('src/actions/actionChain.js', () => ({
  createChain: jest.fn(),
}));

// import after setting up mocks
const { createChain } = await import('../../src/actions/actionChain.js');
const { createChainWithProgress } = await import(
  '../../src/actions/actionChainWithProgress.js'
);

describe('actionChainWithProgress()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    oraMock.text = null;
    oraMock.isSpinning = false;
  });

  test('returns a function', () => {
    const result = createChainWithProgress([{ fn: () => {}, message: 'ASDF' }]);
    expect(result).toEqual(expect.any(Function));
  });

  test('throws if any link is missing the "fn" field', () => {
    expect(() =>
      createChainWithProgress([{ fn: () => {}, message: 'ASDF' }, { message: 'ASDF' }])
    ).toThrow();
  });

  test('throws if any link is missing the "message" field', () => {
    expect(() =>
      createChainWithProgress([{ fn: () => {}, message: 'ASDF' }, { fn: () => {} }])
    ).toThrow();
  });

  test('spinner fail if chain throws', async () => {
    createChain.mockReturnValue(async () => {
      throw new RangeError('FAIL');
    });
    await expect(async () =>
      createChainWithProgress([{ fn: () => {}, message: 'ASDF' }])()
    ).rejects.toThrow(RangeError);
    expect(oraMock.fail).toHaveBeenCalled();
  });

  test('spinner succeed if chain completes', async () => {
    createChain.mockReturnValue(async () => true);
    await createChainWithProgress([{ fn: () => {}, message: 'ASDF' }])();
    expect(oraMock.succeed).toHaveBeenCalled();
  });

  test('spinner succeeds with success message if chain completes', async () => {
    createChain.mockReturnValue(async () => true);
    const expectedMessage = 'ASDFASDFASDF';
    await createChainWithProgress([{ fn: () => {}, message: 'ASDF' }], expectedMessage)();
    expect(oraMock.succeed).toHaveBeenCalledWith(expectedMessage);
  });

  test('spinner stop if chain does not complete', async () => {
    createChain.mockReturnValue(async () => false);
    await createChainWithProgress([{ fn: () => {}, message: 'ASDF' }])();
    expect(oraMock.stop).toHaveBeenCalled();
  });

  test('starts spinner if not spinning', async () => {
    createChain.mockImplementation((links) => async () => {
      for (const link of links) {
        // eslint-disable-next-line no-await-in-loop
        await link();
      }
    });
    oraMock.start.mockImplementation(() => {
      oraMock.isSpinning = true;
    });

    await createChainWithProgress([{ fn: () => {}, message: 'ASDF' }])();
    expect(oraMock.start).toHaveBeenCalledTimes(1);
  });

  test('updates spinner text if spinning', async () => {
    createChain.mockImplementation((links) => async () => {
      for (const link of links) {
        // eslint-disable-next-line no-await-in-loop
        await link();
      }
    });
    oraMock.start.mockImplementation(() => {
      oraMock.isSpinning = true;
    });
    const expected = 'ASDF';

    await createChainWithProgress([
      { fn: () => {}, message: 'FIRST' },
      { fn: () => {}, message: expected },
    ])();
    expect(oraMock.text).toBe(expected);
  });
});
