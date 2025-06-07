import { simple } from 'acorn-walk';
import {
  beforeAllHelper,
  testNoConsoleLog,
  testTodosRemoved,
  hasCommentedOutCode,
} from 'assignment-utils';

describe('getAnonName', () => {
  const state = { paramCount: 0 };
  let getAnonName;
  let exInfo;

  beforeAll(async () => {
    exInfo = await beforeAllHelper(__filename);
    getAnonName = exInfo.module?.getAnonName;

    exInfo.rootNode &&
      simple(exInfo.rootNode, {
        VariableDeclarator({ id, init }) {
          if (id.type === 'Identifier' && id.name === 'getAnonName') {
            if (init?.type === 'ArrowFunctionExpression') {
              state.paramCount = init.params.length;
            }
          }
        },
        FunctionDeclaration({ id, params }) {
          if (id?.type === 'Identifier' && id?.name === 'getAnonName') {
            state.paramCount = params.length;
          }
        },
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
    expect(getAnonName).toBeDefined();
  });

  testTodosRemoved(() => exInfo.source);

  testNoConsoleLog('getAnonName', () => exInfo.rootNode);

  test('should not contain commented-out code', () => {
    expect(hasCommentedOutCode(exInfo.source)).toBeFalsy();
  });

  test('should call `new Promise()`', () => {
    expect(state.newPromise).toBeDefined();
  });

  test('should take a single argument', () => {
    expect(state.paramCount).toBe(1);
  });

  test('`resolve()` should be called with a one argument', () => {
    expect(state.resolve).toBe(1);
  });

  test('`reject()` should be called with a one argument', () => {
    expect(state.reject).toBe(1);
  });

  test('should resolve when called with a string argument', async () => {
    expect.assertions(3);
    expect(getAnonName).toBeDefined();

    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => fn());

    const promise = getAnonName('John');

    setTimeoutSpy.mockRestore();

    expect(promise).toBeInstanceOf(Promise);
    return expect(promise).resolves.toEqual('John Doe');
  });

  test('should reject with an Error object when called without an argument', async () => {
    expect.assertions(3);
    expect(getAnonName).toBeDefined();

    const promise = getAnonName();

    expect(promise).toBeInstanceOf(Promise);
    return expect(promise).rejects.toBeInstanceOf(Error);
  });

  test('should resolve with "<firstName> Doe" for various names', async () => {
    await expect(getAnonName('Alice')).resolves.toBe('Alice Doe');
    await expect(getAnonName('Bob')).resolves.toBe('Bob Doe');
    await expect(getAnonName('Jane')).resolves.toBe('Jane Doe');
  });

  test('should reject with an Error if firstName is an empty string', async () => {
    await expect(getAnonName('')).rejects.toBeInstanceOf(Error);
    await expect(getAnonName('')).rejects.toThrow(
      "You didn't pass in a first name!"
    );
  });

  test('should reject with an Error if firstName is null or undefined', async () => {
    // @ts-ignore
    await expect(getAnonName()).rejects.toBeInstanceOf(Error);
    await expect(getAnonName(null)).rejects.toBeInstanceOf(Error);
    await expect(getAnonName(undefined)).rejects.toBeInstanceOf(Error);
  });
});
