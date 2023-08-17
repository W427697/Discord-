/* eslint-disable import/no-extraneous-dependencies,import/no-named-default */
import { default as expectPatched } from '@storybook/expect';
import { instrument } from '@storybook/instrumenter';
import * as matchers from '@testing-library/jest-dom/matchers';
import * as _mock from '@vitest/spy';
export type * from '@vitest/spy';

export const { mock } = instrument({ mock: _mock }, { retain: true });

/**
 * The `expect` function is used every time you want to test a value.
 * You will rarely call `expect` by itself.
 */
export interface Expect extends Pick<jest.Expect, keyof jest.Expect> {
  /**
   * The `expect` function is used every time you want to test a value.
   * You will rarely call `expect` by itself.
   *
   * @param actual The value to apply matchers against.
   */
  <T = any>(actual: T): jest.JestMatchersShape<
    jest.Matchers<Promise<void>, T>,
    jest.Matchers<Promise<void>, T>
  >;
}

expectPatched.extend(matchers);

export const expect: Expect = instrument(
  { expect: expectPatched },
  { intercept: (_method, path) => path[0] !== 'expect' }
).expect as unknown as Expect;
