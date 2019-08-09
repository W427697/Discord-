import { Preset, ConfigCollector, PresetProp } from './types/presets';
import { Config, ConfigValues } from './types/api';
import { apply, prependPresetToCollection, appendPresetToCollection } from './presets';

import * as defaults from './defaults';
import { Options } from './types/cli';

import { createCallPreset } from './presets/call-preset';
import { createCLIPreset } from './presets/cli-preset';

export function getConfig(
  { configFile, cliOptions, callOptions, envOptions }: Options,
  extraPresets: Preset[] = []
): Config {
  let collector: ConfigCollector;

  const cache: Partial<Config> = {};
  let initialized = false;

  const config: Config = new Proxy(cache, {
    get: async (target, prop: keyof Config) => {
      if (!initialized) {
        collector = await import(configFile);
        collector = await prependPresetToCollection(collector, defaults as Preset);
        collector = await appendPresetToCollection(collector, {}, [
          createCallPreset(callOptions),
          createCLIPreset(cliOptions),
          ...extraPresets,
        ]);
        initialized = true;
      }

      if (typeof prop !== 'string') {
        return { cache, collector };
      }

      if (!cache[prop]) {
        const list = collector[prop];
        type V = ConfigValues[typeof prop];

        const output = list ? apply<V>(list, config) : ([] as PresetProp<V>[]);

        // @ts-ignore - pinky promise that the Partial<V> will become V after all presets have been applied
        cache[prop] = output;
      }

      return cache[prop];
    },
  }) as Config;

  return config;
}

export { Config, ConfigValues };
