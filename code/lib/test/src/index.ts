import { instrument } from '@storybook/instrumenter';
import * as spy from '@vitest/spy';
import chai from 'chai';
import { expect as rawExpect } from './expect';
import { FORCE_REMOUNT, STORY_RENDER_PHASE_CHANGED } from '@storybook/core-events';
import { addons } from '@storybook/preview-api';
export * from '@vitest/spy';

const channel = addons.getChannel();

channel.on(FORCE_REMOUNT, () => spy.spies.forEach((mock) => mock.mockClear()));
channel.on(STORY_RENDER_PHASE_CHANGED, ({ newPhase }) => {
  if (newPhase === 'loading') spy.spies.forEach((mock) => mock.mockClear());
});

export const { expect } = instrument(
  { expect: rawExpect },
  {
    getKeys: (obj: Record<string, unknown>) => {
      const privateApi = ['assert', '__methods', '__flags'];
      if (obj.constructor === chai.Assertion) {
        return Object.keys(Object.getPrototypeOf(obj)).filter((it) => !privateApi.includes(it));
      }
      return Object.keys(obj);
    },
    intercept: (method) => method !== 'expect',
  }
);

export * from './testing-library';
