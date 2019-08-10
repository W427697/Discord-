import { config as configTransforms } from '@storybook/transforms';

import { mergeSettings } from './utils/mergeSettings';

import {
  getStorybookConfigPath,
  getCacheDir,
  getConfigFileName,
  getCoreDir,
  getConfigFilePath,
} from './paths';

import { cached, write } from './persist';
import { Config, ConfigFiles, FileName } from './types/files';
import { Preset, PresetMergeAsyncFn, PresetMergeFn } from './types/presets';
import { CliOptions, CallOptions, EnvOptions } from './types/cli';
import { createOverloadPreset } from './utils/overload';

const createMain = (files: FileName[]) => {
  const key = 'all';
  const name = getConfigFilePath(key);

  return cached(key, async () => {
    const { code } = await configTransforms.collector(files);
    await write(name, code);
  });
};

const createFiltered = async ([key, targets]: [string, string[]]) => {
  const baseFileUrl = getConfigFilePath('all');
  const name = getConfigFilePath(key);

  return cached(key, async () => {
    const { code } = await configTransforms.filter(baseFileUrl, targets);
    await write(name, code);
  });
};

const createOverload = async (
  envOptions: EnvOptions,
  cliOptions: CliOptions,
  callOptions: CallOptions
) => {
  const key = 'overload';
  const name = getConfigFilePath(key);

  const { code } = await createOverloadPreset(envOptions, cliOptions, callOptions);
  await write(name, code);
};

const defaultSettings: Config = {
  manager: ['theme', 'managerInit'],
  preview: ['previewInit'],
  server: ['server', 'entries', 'webpack', 'babel', 'managerWebpack', 'managerBabel'],
};

export const getStorybookConfigs = async ({
  callOptions,
  cliOptions,
  customSettings,
  envOptions,
}: {
  customSettings?: Config;
  callOptions?: CallOptions;
  cliOptions?: CliOptions;
  envOptions?: EnvOptions;
} = {}) => {
  const file: FileName = await getStorybookConfigPath();

  if (file) {
    const configList = Object.entries(mergeSettings(defaultSettings, customSettings));
    const files = configList.reduce<ConfigFiles>((acc, [key]) => {
      return {
        ...acc,
        [key]: {
          id: key,
          location: getConfigFilePath(key),
        },
      };
    }, {});

    const defaults: FileName = require.resolve('./defaults/index');
    const overload: FileName = getConfigFilePath('overload');

    await createOverload(envOptions, cliOptions, callOptions);
    await createMain([defaults, file, overload]);

    await Promise.all(configList.map(createFiltered));

    return files;
  }
  return undefined;
};

export { getCacheDir, getStorybookConfigPath, getConfigFileName, getCoreDir };

export { ConfigFiles, Preset, PresetMergeAsyncFn, PresetMergeFn };
