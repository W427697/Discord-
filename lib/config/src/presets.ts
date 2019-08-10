import { logger } from '@storybook/node-logger';

import { mergeConfig } from './utils/mergeConfig';

import {
  ConfigCollector,
  PresetProperties,
  PresetRef,
  PresetFn,
  Preset,
  PresetProp,
  PresetMergeFn,
} from './types/presets';
import { Config } from './types/api';

export async function getProperties(preset: PresetFn | PresetRef | Preset): Promise<Preset> {
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
        preset should be a string (PresetRef), function (PresetFn), or an object (Preset). 
        The provided value did not match, therefore it was skipped.
      `);
      return {};
    }
  }
}

export function appendPropertyToCollector<K extends keyof ConfigCollector>(
  collector: ConfigCollector,
  [key, value]: [K, PresetProperties[K]]
): ConfigCollector {
  if (value && key) {
    const list = [...(collector[key] || []), value];

    return Object.assign({}, collector, { [key]: list });
  }
  return collector;
}
export function prependPropertyToCollector<K extends keyof ConfigCollector>(
  collector: ConfigCollector,
  [key, value]: [K, PresetProperties[K]]
): ConfigCollector {
  if (value && key) {
    const list = [value, ...(collector[key] || [])];

    return Object.assign({}, collector, { [key]: list });
  }
  return collector;
}

export async function appendPresetToCollection(
  collector: ConfigCollector,
  preset: PresetFn | PresetRef | Preset,
  additional?: (PresetFn | PresetRef | Preset)[]
): Promise<ConfigCollector> {
  const { presets, addons, ...m } = await getProperties(preset);

  const c = Object.entries(m).reduce(appendPropertyToCollector, collector);

  return []
    .concat(presets || [])
    .concat(addons || [])
    .concat(additional || [])
    .filter(Boolean)
    .reduce(async (pacc: Promise<ConfigCollector>, i: PresetFn | PresetRef | Preset) => {
      const acc = await pacc;

      // RECURSION
      return appendPresetToCollection(acc, i);
    }, Promise.resolve(c));
}
export async function prependPresetToCollection(
  collector: ConfigCollector,
  preset: PresetFn | PresetRef | Preset,
  additional?: (PresetFn | PresetRef | Preset)[]
): Promise<ConfigCollector> {
  const { presets, addons, ...m } = await getProperties(preset);

  const c = Object.entries(m).reduce(appendPropertyToCollector, collector);

  return []
    .concat(presets || [])
    .concat(addons || [])
    .concat(additional || [])
    .filter(Boolean)
    .reduce(async (pacc: Promise<ConfigCollector>, i: PresetFn | PresetRef | Preset) => {
      const acc = await pacc;

      // RECURSION
      return prependPresetToCollection(acc, i);
    }, Promise.resolve(c));
}

export async function apply<K>(list: PresetProp<K>[], config: Config): Promise<K> {
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
        const fn = item as PresetMergeFn<K>;
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
