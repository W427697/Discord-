import { instrument } from '@storybook/core/dist/instrumenter';
import { type LoaderFunction } from '@storybook/csf';
import chai from 'chai';
import { global } from '@storybook/global';
import { expect as rawExpect } from './expect';
import {
  clearAllMocks,
  fn,
  isMockFunction,
  onMockCall,
  resetAllMocks,
  restoreAllMocks,
} from './spy';
import type { Renderer } from '@storybook/core/dist/types';

export * from './spy';

export const { expect } = instrument(
  { expect: rawExpect },
  {
    getKeys: (obj: Record<string, unknown>, depth) => {
      const privateApi = ['assert', '__methods', '__flags', '_obj'];
      if (obj.constructor === chai.Assertion) {
        const keys = Object.keys(Object.getPrototypeOf(obj)).filter(
          (it) => !privateApi.includes(it)
        );
        return depth > 2 ? keys : [...keys, 'not'];
      }
      return Object.keys(obj);
    },
    intercept: (method) => method !== 'expect',
  }
);

export * from './testing-library';

const resetAllMocksLoader: LoaderFunction = ({ parameters }) => {
  if (parameters?.test?.mockReset === true) {
    resetAllMocks();
  } else if (parameters?.test?.clearMocks === true) {
    clearAllMocks();
  } else if (parameters?.test?.restoreMocks !== false) {
    restoreAllMocks();
  }
};

export const traverseArgs = (value: unknown, depth = 0, key?: string): unknown => {
  // Make sure to not get in infinite loops with self referencing args
  if (depth > 5) return value;
  if (value == null) return value;
  if (isMockFunction(value)) {
    // Makes sure we get the arg name in the interactions panel
    if (key) value.mockName(key);
    return value;
  }

  // wrap explicit actions in a spy
  if (
    typeof value === 'function' &&
    'isAction' in value &&
    value.isAction &&
    !('implicit' in value && value.implicit)
  ) {
    const mock = fn(value as any);
    if (key) mock.mockName(key);
    return mock;
  }

  if (Array.isArray(value)) {
    depth++;
    return value.map((item) => traverseArgs(item, depth));
  }

  if (typeof value === 'object' && value.constructor === Object) {
    depth++;
    for (const [k, v] of Object.entries(value)) {
      if (Object.getOwnPropertyDescriptor(value, k)?.writable) {
        // We have to mutate the original object for this to survive HMR.
        (value as Record<string, unknown>)[k] = traverseArgs(v, depth, k);
      }
    }
    return value;
  }
  return value;
};

const nameSpiesAndWrapActionsInSpies: LoaderFunction<Renderer> = ({ initialArgs }) => {
  traverseArgs(initialArgs);
};

// We are using this as a default Storybook loader, when the test package is used. This avoids the need for optional peer dependency workarounds.
// eslint-disable-next-line no-underscore-dangle
(global as any).__STORYBOOK_TEST_LOADERS__ = [resetAllMocksLoader, nameSpiesAndWrapActionsInSpies];
// eslint-disable-next-line no-underscore-dangle
(global as any).__STORYBOOK_TEST_ON_MOCK_CALL__ = onMockCall;
