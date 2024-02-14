/* eslint-disable no-underscore-dangle */
import type { Args, ArgsEnhancer, Renderer } from '@storybook/types';
import { instrument } from '@storybook/instrumenter';
import { fn } from '@storybook/test';

const addSpies = (value: unknown, depth = 0): any => {
  // Make sure to not get in infinite loops with self referencing args
  if (depth > 5) return value;

  if (value == null) return value;
  if (
    typeof value === 'function' &&
    'isAction' in value &&
    value.isAction &&
    !('implicit' in value && value.implicit) &&
    !('_isMockFunction' in value && value._isMockFunction)
  ) {
    return fn(value as any);
  }

  if (Array.isArray(value)) {
    return value.map((item) => addSpies(item, depth++));
  }

  if (typeof value === 'object') {
    // We have to mutate the original object for this to survive HMR.

    for (const [k, v] of Object.entries(value)) {
      (value as Record<string, unknown>)[k] = addSpies(v, depth++);
    }
    return value;
  }
  return value;
};

const wrapActionsInSpyFns: ArgsEnhancer<Renderer> = ({ initialArgs }) => addSpies(initialArgs);

const instrumentSpies: ArgsEnhancer = ({ initialArgs }) => {
  const argTypesWithAction = Object.entries(initialArgs).filter(
    ([, value]) =>
      typeof value === 'function' &&
      '_isMockFunction' in value &&
      value._isMockFunction &&
      !value._instrumented
  );

  return argTypesWithAction.reduce((acc, [key, value]) => {
    const instrumented = instrument({ [key]: () => value }, { retain: true })[key];
    acc[key] = instrumented();
    // this enhancer is being called multiple times
    value._instrumented = true;
    return acc;
  }, {} as Args);
};

export const argsEnhancers = [wrapActionsInSpyFns, instrumentSpies];

export const parameters = {
  throwPlayFunctionExceptions: false,
};
