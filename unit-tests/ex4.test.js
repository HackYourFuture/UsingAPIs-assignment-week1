import { simple } from 'acorn-walk';

import {
  beforeAllHelper,
  testNoConsoleLog,
  testTodosRemoved,
  hasCommentedOutCode,
} from 'assignment-utils';

describe('pokerDiceAll', () => {
  const state = {};

  let exInfo;
  let rollDice;
  let explanation;

  beforeAll(async () => {
    exInfo = await beforeAllHelper(__filename);
    rollDice = exInfo.module?.rollDice;
    explanation = exInfo.module?.explanation;

    exInfo.rootNode &&
      simple(exInfo.rootNode, {
        MemberExpression({ object, property }) {
          if (object.type === 'Identifier' && property.type === 'Identifier') {
            if (object.name === 'Promise' && property.name === 'all') {
              state.promiseAll = true;
            } else if (object.name === 'dice' && property.name === 'map') {
              state.diceMap = true;
            }
          }
        },
      });
  });

  test('should exist and be executable', () => {
    expect(rollDice).toBeDefined();
  });

  testTodosRemoved(() => exInfo.source);

  testNoConsoleLog('rollDice', () => exInfo.rootNode);

  test('should not contain commented-out code', () => {
    expect(hasCommentedOutCode(exInfo.source)).toBeFalsy();
  });

  test('should use `dice.map()`', () => {
    expect(state.diceMap).toBeDefined();
  });

  test('should use `Promise.all()`', () => {
    expect(state.promiseAll).toBeDefined();
  });

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

    expect(exInfo).toBeDefined();

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

  test('explanation placeholder should be replaced', () => {
    expect(explanation).toBeDefined();
    expect(explanation).not.toContain('placeholder with your explanation');
  });
});
