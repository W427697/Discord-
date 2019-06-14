import fs from 'fs-extra';
import isPlainObject from 'is-plain-object';

import { logger } from '@storybook/node-logger';

import { merge } from './utils/merge';

import { StorybookConfig, Preset, CallOptions } from './types';

// this function takes 2 functions and returns a single function
// then nests these functions, where the result of fn2 is passed as the first arg to fn1
// the remaining arguments are passed to all functions
type MergableFn<X> = (base: X, ...args: any[]) => Promise<X>;
const mergeFunctions = <X>(fn1: MergableFn<X>, fn2: MergableFn<X>) => {
  return async (base: X, ...args: any[]): Promise<X> => {
    return fn1(await fn2(base, ...args), ...args);
  };
};

// mapping legacy preset keys to newer ones
export const legacyPresetKeyMapper = (key: string): keyof StorybookConfig => {
  if (key === 'webpackFinal') {
    return 'webpack';
  }
  if (key === 'babelDefault') {
    return 'babel';
  }
  return key as keyof StorybookConfig;
};

type ValueOf<T> = T[keyof T];

// create a new config by applying a preset on it
export const applyPreset = (preset: StorybookConfig, base: StorybookConfig) => ({
  ...base,

  ...Object.entries(preset).reduce(
    (acc: StorybookConfig, [k, v]: [keyof StorybookConfig, ValueOf<StorybookConfig>]) => {
      if (k && v) {
        // legacy
        const key = legacyPresetKeyMapper(k);

        switch (key) {
          case 'babel':
          case 'webpack':
          case 'managerBabel':
          case 'managerWebpack': {
            if (typeof v === 'function') {
              return { ...acc, [key]: base[key] ? mergeFunctions(v, base[key]) : v };
            }
            return acc;
          }
          case 'entries': {
            if (Array.isArray(v)) {
              const existing = base[key] as StorybookConfig['entries'];
              return { ...acc, entries: base.entries ? [...existing, ...v] : v };
            }
            return acc;
          }
          case 'presets': {
            // are already handled by applyPresets
            return acc;
          }
          case 'template':
          case 'managerTemplate': {
            if (typeof v === 'string') {
              return { ...acc, [key]: v };
            }
            return acc;
          }
          case 'server': {
            if (isPlainObject(v)) {
              const existing: StorybookConfig['server'] = base[key];
              return { ...acc, server: base.server ? merge(v, existing) : v };
            }
            return acc;
          }
          default: {
            return acc;
          }
        }
      }
      return acc;
    },
    base
  ),
});

// this is some bad-ass code right here
// we will recurse into sub-presets, extending the config until all presets have been handled
// a preset can export presets, and all other config types

// functions should be curried
// arrays should be concatenated
// objects should be merged
export const applyPresets = async (
  presets: Preset[],
  base: StorybookConfig
): Promise<StorybookConfig> => {
  return presets.reduce(async (acc: Promise<StorybookConfig>, preset: Preset): Promise<
    StorybookConfig
  > => {
    const value = await acc;

    if (typeof preset === 'function') {
      const m = await preset();

      const result = applyPreset(m, value) as StorybookConfig;

      return result;
    }
    if (typeof preset === 'string') {
      const exists = await fs.pathExists(preset);
      const m: StorybookConfig | null = exists ? await import(preset) : null;

      if (exists && m) {
        logger.debug(`applying string-preset: "${preset}"`);

        const { presets: mpresets, ...rest } = m;
        const newValue = mpresets ? await applyPresets(mpresets, value) : value;
        return applyPreset(rest, newValue) as StorybookConfig;
      }
      logger.warn(`unloadable string-preset: "${preset}"`);

      return value;
    }

    return value;
  }, Promise.resolve(base));
};

export const getPresets = (
  fromConfig: StorybookConfig,
  fromCall: CallOptions,
  additional?: Preset[]
): Preset[] =>
  []
    .concat(fromConfig.presets || [])
    .concat(fromCall.frameworkPresets || [])
    .concat(fromCall.overridePresets || [])
    .concat(additional || []);
