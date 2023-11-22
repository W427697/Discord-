import { instrument } from '@storybook/instrumenter';
import { type LoaderFunction } from '@storybook/csf';
import chai from 'chai';
import { global } from '@storybook/global';
import { expect as rawExpect } from './expect';
import { clearAllMocks, resetAllMocks, restoreAllMocks } from './spy';

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

// @ts-expect-error Wwe are using this as a default loader, if the test package is used. But we don't want to get into optional peer dep shenanigans.
global.testPackageLoaders = [resetAllMocksLoader];
