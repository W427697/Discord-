import { logger } from '@storybook/node-logger';

import { mergeConfig } from './utils/mergeConfig';

import * as P from './types/presets';
import * as A from './types/api';

export async function getProperties(
  preset: P.PresetFn | P.PresetRef | P.Preset
): Promise<P.Preset> {
  switch (typeof preset) {
    case 'string': {
      return import(preset);
    }
    case 'function': {
      return preset();
    }
    case 'object': {
      return preset;
    }
    default: {
      logger.warn(`
        preset should be a string (P.PresetRef), function (P.PresetFn), or an object (P.Preset). 
        The provided value did not match, therefore it was skipped.
      `);
      return {};
    }
  }
}

export function appendPropertyToCollector<K extends keyof P.ConfigCollector>(
  collector: P.ConfigCollector,
  [key, value]: [K, P.PresetProperties[K]]
): P.ConfigCollector {
  if (value && key) {
    const list = [...(collector[key] || []), value];

    return Object.assign({}, collector, { [key]: list });
  }
  return collector;
}
export function prependPropertyToCollector<K extends keyof P.ConfigCollector>(
  collector: P.ConfigCollector,
  [key, value]: [K, P.PresetProperties[K]]
): P.ConfigCollector {
  if (value && key) {
    const list = [value, ...(collector[key] || [])];

    return Object.assign({}, collector, { [key]: list });
  }
  return collector;
}

export async function appendPresetToCollection(
  collector: P.ConfigCollector,
  preset: P.PresetFn | P.PresetRef | P.Preset,
  additional?: (P.PresetFn | P.PresetRef | P.Preset)[]
): Promise<P.ConfigCollector> {
  const { presets, addons, ...m } = await getProperties(preset);

  const c = Object.entries(m).reduce(appendPropertyToCollector, collector);

  return []
    .concat(presets || [])
    .concat(addons || [])
    .concat(additional || [])
    .filter(Boolean)
    .reduce(async (pacc: Promise<P.ConfigCollector>, i: P.PresetFn | P.PresetRef | P.Preset) => {
      const acc = await pacc;

      // RECURSION
      return appendPresetToCollection(acc, i);
    }, Promise.resolve(c));
}
export async function prependPresetToCollection(
  collector: P.ConfigCollector,
  preset: P.PresetFn | P.PresetRef | P.Preset,
  additional?: (P.PresetFn | P.PresetRef | P.Preset)[]
): Promise<P.ConfigCollector> {
  const { presets, addons, ...m } = await getProperties(preset);

  const c = Object.entries(m).reduce(appendPropertyToCollector, collector);

  return []
    .concat(presets || [])
    .concat(addons || [])
    .concat(additional || [])
    .filter(Boolean)
    .reduce(async (pacc: Promise<P.ConfigCollector>, i: P.PresetFn | P.PresetRef | P.Preset) => {
      const acc = await pacc;

      // RECURSION
      return prependPresetToCollection(acc, i);
    }, Promise.resolve(c));
}

export async function apply<K>(list: P.PresetProp<K>[], config: A.Config): Promise<K> {
  return list.reduce(async (pacc: Promise<K>, item) => {
    const acc: K = await pacc;

    switch (true) {
      // primitives are simply replaced
      case typeof item === 'undefined':
      case typeof item === 'number':
      case typeof item === 'string': {
        return item;
      }
      // functions get called, with previous value & config
      case typeof item === 'function': {
        const fn = item as P.PresetMergeFn<K>;
        return fn(acc, config);
      }
      // arrays get concatenated
      case Array.isArray(item) && (Array.isArray(acc) || typeof acc === 'undefined'): {
        const addition = (item as unknown) as string[];
        const base = (acc || []) as string[];
        return base.concat(addition);
      }
      // objects get merged
      case typeof item === 'object': {
        return mergeConfig({}, acc, item);
      }
      default: {
        logger.warn('there was a type mismatch between ');
        return acc;
      }
    }
  }, Promise.resolve(undefined));
}
