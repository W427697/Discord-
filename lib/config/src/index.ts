import { apply, appendPresetToCollection } from './presets';

import * as P from './types/presets';
import * as A from './types/api';
import * as C from './types/cli';

export function getConfig({ configFile }: C.Options, extraPresets: P.Preset[] = []): A.Config {
  let collector: P.ConfigCollector;

  const cache: Partial<A.Config> = {};
  let initialized = false;

  const config: A.Config = new Proxy(cache, {
    get: async (target, prop: keyof A.Config) => {
      if (!initialized) {
        collector = await import(configFile);
        collector = await appendPresetToCollection(collector, {}, [...extraPresets]);
        initialized = true;
      }

      if (typeof prop !== 'string') {
        return { cache, collector };
      }

      if (!cache[prop]) {
        const list = collector[prop];
        type V = A.ConfigValues[typeof prop];

        const output = list ? apply<V>(list, config) : ([] as P.PresetProp<V>[]);

        // @ts-ignore - pinky promise that the Partial<V> will become V after all presets have been applied
        cache[prop] = output;
      }

      return cache[prop];
    },
  }) as A.Config;

  return config;
}

export * from './types/cli';

export { P };
export { A };
