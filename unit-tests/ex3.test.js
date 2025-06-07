import { simple } from 'acorn-walk';

import {
  beforeAllHelper,
  hasCommentedOutCode,
  testTodosRemoved,
} from 'assignment-utils';

describe('rollDie', () => {
  const state = {};

  let rollDie;
  let exInfo;
  let explanation;

  beforeAll(async () => {
    exInfo = await beforeAllHelper(__filename);
    rollDie = exInfo.module?.rollDie;
    explanation = exInfo.module?.explanation;

    exInfo.rootNode &&
      simple(exInfo.rootNode, {
        NewExpression({ callee }) {
          if (callee.type === 'Identifier' && callee.name === 'Promise') {
            state.newPromise = true;
          }
        },
        CallExpression({ callee, arguments: args }) {
          if (
            callee.type === 'Identifier' &&
            ['resolve', 'reject'].includes(callee.name)
          ) {
            state[callee.name] = args.length;
          }
        },
      });
  });

  test('should exist and be executable', () => {
    expect(rollDie).toBeDefined();
  });

  testTodosRemoved(() => exInfo.source);

  test('should not contain commented-out code', () => {
    expect(hasCommentedOutCode(exInfo.source)).toBeFalsy();
  });

  test('should call `new Promise()`', () => {
    expect(state.newPromise).toBeDefined();
  });

  test('`resolve()` should be called with a one argument', () => {
    expect(state.resolve).toBe(1);
  });

  test('`reject()` should be called with a one argument', () => {
    expect(state.reject).toBe(1);
  });

  test('should resolve when the die settles successfully', () => {
    expect.assertions(3);
    expect(rollDie).toBeDefined();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    const promise = rollDie();
    expect(promise).toBeInstanceOf(Promise);

    const assertionPromise = expect(promise).resolves.toBeDefined();

    promise.finally(() => {
      setTimeoutSpy.mockRestore();
      randomSpy.mockRestore();
      logSpy.mockRestore();
    });

    return assertionPromise;
  });

  test('should reject with an Error when the die rolls off the table', async () => {
    expect.assertions(3);
    expect(rollDie).toBeDefined();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999);
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    try {
      const promise = rollDie();
      expect(promise).toBeInstanceOf(Promise);

      await promise;
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      setTimeoutSpy.mockRestore();
      randomSpy.mockRestore();
      logSpy.mockRestore();
    }
  });

  test('should resolve with a value between 1 and 6 when die settles', async () => {
    // Force Math.random to always return 0.2 for predictable rolls
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.2);
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    const result = await rollDie();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);

    setTimeoutSpy.mockRestore();
    randomSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('should reject with an Error if die rolls more than 6 times', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Force Math.random to always return 0.99 so randomRollsToDo = 10
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    await expect(rollDie()).rejects.toThrow(
      'Oops... Die rolled off the table.'
    );

    setTimeoutSpy.mockRestore();
    randomSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('should log the correct messages during execution', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    await rollDie();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Die scheduled for')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Die value is now:')
    );

    setTimeoutSpy.mockRestore();
    randomSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('explanation placeholder should be replaced', () => {
    expect(explanation).toBeDefined();
    expect(explanation).not.toContain('placeholder with your explanation');
  });
});
