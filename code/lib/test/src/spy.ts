/* eslint-disable @typescript-eslint/no-shadow */
import type { Mock } from '@vitest/spy';
import {
  spyOn,
  isMockFunction,
  fn as vitestFn,
  mocks,
  type MaybeMocked,
  type MaybeMockedDeep,
  type MaybePartiallyMocked,
  type MaybePartiallyMockedDeep,
} from '@vitest/spy';
import type { SpyInternalImpl } from 'tinyspy';
import * as tinyspy from 'tinyspy';

export type * from '@vitest/spy';

export { spyOn, isMockFunction, mocks };

type Listener = (mock: Mock, args: unknown[]) => void;
let listeners: Listener[] = [];

export function onMockCalled(callback: Listener): () => void {
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

export function fn<TArgs extends any[] = any, R = any>(): Mock<TArgs, R>;
export function fn<TArgs extends any[] = any[], R = any>(
  implementation: (...args: TArgs) => R
): Mock<TArgs, R>;
export function fn<TArgs extends any[] = any[], R = any>(implementation?: (...args: TArgs) => R) {
  const mock = implementation ? vitestFn(implementation) : vitestFn();
  const reactive = reactiveMock(mock);
  const originalMockImplementation = reactive.mockImplementation.bind(null);
  reactive.mockImplementation = (fn) => reactiveMock(originalMockImplementation(fn));
  return reactive;
}

function reactiveMock(mock: Mock) {
  const state = tinyspy.getInternalState(mock as unknown as SpyInternalImpl);
  const impl = state.impl?.bind(null);
  state.willCall((...args) => {
    listeners.forEach((listener) => listener(mock, args));
    impl?.(...args);
  });
  return mock;
}

/**
 * Calls [`.mockClear()`](https://vitest.dev/api/mock#mockclear) on every mocked function. This will only empty `.mock` state, it will not reset implementation.
 *
 * It is useful if you need to clean up mock between different assertions.
 */
export function clearAllMocks() {
  mocks.forEach((spy) => spy.mockClear());
}

/**
 * Calls [`.mockReset()`](https://vitest.dev/api/mock#mockreset) on every mocked function. This will empty `.mock` state, reset "once" implementations and force the base implementation to return `undefined` when invoked.
 *
 * This is useful when you want to completely reset a mock to the default state.
 */
export function resetAllMocks() {
  mocks.forEach((spy) => spy.mockReset());
}

/**
 * Calls [`.mockRestore()`](https://vitest.dev/api/mock#mockrestore) on every mocked function. This will restore all original implementations.
 */
export function restoreAllMocks() {
  mocks.forEach((spy) => spy.mockRestore());
}

/**
 * Type helper for TypeScript. Just returns the object that was passed.
 *
 * When `partial` is `true` it will expect a `Partial<T>` as a return value. By default, this will only make TypeScript believe that
 * the first level values are mocked. You can pass down `{ deep: true }` as a second argument to tell TypeScript that the whole object is mocked, if it actually is.
 *
 * @param item Anything that can be mocked
 * @param deep If the object is deeply mocked
 * @param options If the object is partially or deeply mocked
 */
export function mocked<T>(item: T, deep?: false): MaybeMocked<T>;
export function mocked<T>(item: T, deep: true): MaybeMockedDeep<T>;
export function mocked<T>(item: T, options: { partial?: false; deep?: false }): MaybeMocked<T>;
export function mocked<T>(item: T, options: { partial?: false; deep: true }): MaybeMockedDeep<T>;
export function mocked<T>(
  item: T,
  options: { partial: true; deep?: false }
): MaybePartiallyMocked<T>;
export function mocked<T>(
  item: T,
  options: { partial: true; deep: true }
): MaybePartiallyMockedDeep<T>;
export function mocked<T>(item: T): MaybeMocked<T>;
export function mocked<T>(item: T, _options = {}): MaybeMocked<T> {
  return item as any;
}
