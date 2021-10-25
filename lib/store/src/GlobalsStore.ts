import { Globals, GlobalTypes } from '@storybook/csf';
import global from 'global';
import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';

import { deepDiff, DEEPLY_EQUAL } from './args';

const setUndeclaredWarning = deprecate(
  () => {},
  dedent`
    Setting a global value that is undeclared (i.e. not in the user's initial set of globals
    or globalTypes) is deprecated and will have no effect in 7.0.
  `
);

export class GlobalsStore {
  allowedGlobalNames: Set<string>;

  initialGlobals: Globals;

  globals: Globals = {};

  set({ globals = {}, globalTypes = {} }: { globals?: Globals; globalTypes?: GlobalTypes }) {
    const delta = this.initialGlobals && deepDiff(this.initialGlobals, this.globals);

    this.allowedGlobalNames = new Set([...Object.keys(globals), ...Object.keys(globalTypes)]);

    const defaultGlobals = Object.entries(globalTypes).reduce((acc, [key, { defaultValue }]) => {
      if (defaultValue) acc[key] = defaultValue;
      return acc;
    }, {} as Globals);
    this.initialGlobals = { ...defaultGlobals, ...globals };

    this.globals = this.initialGlobals;
    if (delta && delta !== DEEPLY_EQUAL) {
      this.updateFromPersisted(delta);
    }
  }

  filterAllowedGlobals(globals: Globals) {
    return Object.entries(globals).reduce((acc, [key, value]) => {
      if (this.allowedGlobalNames.has(key)) acc[key] = value;
      return acc;
    }, {} as Globals);
  }

  updateFromPersisted(urlGlobals?: Globals) {
    if (urlGlobals) {
      // Note that unlike args, we do not have the same type information for globals to allow us
      // to type check them here, so we just set them naively
      this.globals = { ...this.globals, ...this.filterAllowedGlobals(urlGlobals) };
    }
    try {
      // eslint-disable-next-line no-underscore-dangle
      this.globals = { ...this.globals, ...global.window.parent.__STORYBOOK_GLOBALS__ };
    } catch (e) {
      // Accessing window.parent might fail due to CORS restrictions
    }
  }

  get() {
    return this.globals;
  }

  update(newGlobals: Globals) {
    Object.keys(newGlobals).forEach((key) => {
      if (!this.allowedGlobalNames.has(key)) {
        setUndeclaredWarning();
      }
    });

    this.globals = { ...this.globals, ...newGlobals };
  }

  persist() {
    try {
      // eslint-disable-next-line no-underscore-dangle
      global.window.parent.__STORYBOOK_GLOBALS__ = this.globals;
    } catch (e) {
      // Accessing window.parent might fail due to CORS restrictions
    }
  }
}
