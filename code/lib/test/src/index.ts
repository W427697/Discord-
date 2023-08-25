import { instrument } from '@storybook/instrumenter';
import * as spy from '@vitest/spy';
import chai from 'chai';
import { expect as rawExpect } from './expect';

export * from '@vitest/spy';

export const { fn } = instrument({ fn: spy.fn }, { retain: true });

export const { expect } = instrument(
  { expect: rawExpect },
  {
    getKeys: (obj) => {
      const privateApi = ['assert', '__methods', '__flags'];
      if (obj.constructor === chai.Assertion) {
        return Object.keys(Object.getPrototypeOf(obj)).filter((it) => !privateApi.includes(it));
      }
      return Object.keys(obj);
    },
    intercept: true,
  }
);
