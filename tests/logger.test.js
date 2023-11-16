import { describe, jest, test, afterEach } from '@jest/globals';
import { mockConfig } from './mocks.js';

// setup mocks
mockConfig();
jest.unstable_mockModule('winston', () => ({
  createLogger: jest.fn(),
  format: {
    simple: () => ({
      transform: jest.fn(({ level, message }) => ({
        message: `${level}: ${message}`,
      })),
    }),
    combine: jest.fn(),
    errors: jest.fn(),
    splat: jest.fn(),
    json: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
  addColors: jest.fn(),
}));
jest.unstable_mockModule('node:process', () => ({
  exit: jest.fn(),
}));
jest.unstable_mockModule('triple-beam', () => ({
  LEVEL: 'level',
  MESSAGE: 'message',
}));
jest.unstable_mockModule('../src/festive.js', () => ({
  FestiveTransport: jest.fn(),
}));

// import after mocks set up.
describe('logger', () => {
  const consoleError = console.error;

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    console.error = consoleError;
  });

  test('exits if createLogger throws', async () => {
    const { createLogger } = await import('winston');
    const { exit } = await import('node:process');
    console.error = jest.fn();
    createLogger.mockImplementationOnce(() => {
      throw new Error('AHHHHHH');
    });
    await import('../src/logger.js');
    expect(exit).toHaveBeenCalled();
  });

  describe('printfCustomFormat()', () => {
    test('level is not error - uses simple format', async () => {
      const info = { level: 'debug', message: 'hi there!' };
      const { printfCustomFormat } = await import('../src/logger.js');
      const result = printfCustomFormat(info);
      expect(result).toBe(`${info.level}: ${info.message}`);
    });

    test('level is error - explicit simple format', async () => {
      const info = {
        level: 'error',
        message: 'hi there!',
        simpleErrorFormat: true,
      };
      const { printfCustomFormat } = await import('../src/logger.js');
      const result = printfCustomFormat(info);
      expect(result).toBe(`${info.level}: ${info.message}`);
    });

    test('level is error - non-explicit simple format (prints stack)', async () => {
      const info = {
        level: 'error',
        message: 'hi there!',
        stack: 'my stack!',
        simpleErrorFormat: false,
      };
      const { printfCustomFormat } = await import('../src/logger.js');
      const result = printfCustomFormat(info);
      expect(result).toBe(`${info.level}: ${info.stack}`);
    });

    test('level is error - non-explicit simple format (prints message if no stack)', async () => {
      const info = {
        level: 'error',
        message: 'hi there!',
        simpleErrorFormat: false,
      };
      const { printfCustomFormat } = await import('../src/logger.js');
      const result = printfCustomFormat(info);
      expect(result).toBe(`${info.level}: ${info.message}`);
    });
  });
});
