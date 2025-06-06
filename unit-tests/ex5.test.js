import {
  beforeAllHelper,
  testNoConsoleLog,
  testTodosRemoved,
} from './unit-test-helpers.js';

describe('pokerDiceChain', () => {
  let exInfo;
  let rollDice;

  beforeAll(async () => {
    exInfo = await beforeAllHelper(__filename);
    rollDice = exInfo.module?.rollDice;
  });

  test('should exist and be executable', () => {
    expect(rollDice).toBeDefined();
  });

  testTodosRemoved(() => exInfo.source);

  testNoConsoleLog('rollDice', () => exInfo.rootNode);

  test('should resolve when all dice settle successfully', async () => {
    expect.assertions(4);
    expect(rollDice).toBeDefined();

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const promise = rollDice();

    expect(promise).toBeInstanceOf(Promise);

    const result = await promise;
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);

    promise.finally(() => {
      randomSpy.mockRestore();
    });
  });

  test('should reject with an Error when a die rolls off the table', async () => {
    expect.assertions(3);
    expect(rollDice).toBeDefined();

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999);

    try {
      const promise = rollDice();
      expect(promise).toBeInstanceOf(Promise);
      await promise;
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('should reject immediately when first die rolls off the table', async () => {
    expect.assertions(2);
    expect(rollDice).toBeDefined();

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999);

    try {
      await rollDice();
      fail('Expected promise to reject');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('should reject when third die rolls off the table', async () => {
    expect.assertions(2);
    expect(rollDice).toBeDefined();

    let callCount = 0;
    const randomSpy = jest.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      return callCount === 3 ? 0.999 : 0.1; // Third call returns off-table value
    });

    try {
      await rollDice();
      fail('Expected promise to reject');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('should handle multiple successive calls independently', async () => {
    expect.assertions(5);
    expect(rollDice).toBeDefined();

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const result1 = await rollDice();
    const result2 = await rollDice();

    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
    expect(result1).toHaveLength(5);
    expect(result2).toHaveLength(5);

    randomSpy.mockRestore();
  });
});
