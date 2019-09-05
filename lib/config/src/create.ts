import { config as configTransforms, prettier } from '@storybook/transforms';

import { mergeSettings } from './utils/mergeSettings';

import {
  getStorybookConfigPath,
  getCacheDir,
  getConfigFileName,
  getCoreDir,
  getConfigFilePath,
} from './paths';

import { cached, write } from './persist';
import { createOverloadPreset } from './utils/overload';

import * as F from './types/files';
import * as C from './types/cli';

const createMain = (files: F.FileName[]) => {
  const key = 'all';
  const name = getConfigFilePath(key);

  return cached(key, async () => {
    const { code } = await configTransforms.collector(files);
    const prettycode = await prettier(code);

    await write(name, prettycode);
  });
};

const createFiltered = async ([key, targets]: [string, string[]]) => {
  const baseFileUrl = getConfigFilePath('all');
  const name = getConfigFilePath(key);

  return cached(key, async () => {
    const { code } = await configTransforms.filter(baseFileUrl, targets);
    const prettycode = await prettier(code);

    await write(name, prettycode);
  });
};

const createOverload = async (
  envOptions: C.EnvOptions,
  cliOptions: C.CliOptions,
  callOptions: C.CallOptions
) => {
  const key = 'overload';
  const name = getConfigFilePath(key);

  return cached(key, async () => {
    const { code } = await createOverloadPreset(envOptions, cliOptions, callOptions);
    await write(name, code);
  });
};

const defaultSettings: F.Config = {
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
  customSettings?: F.Config;
  callOptions?: C.CallOptions;
  cliOptions?: C.CliOptions;
  envOptions?: C.EnvOptions;
} = {}) => {
  const file: F.FileName = await getStorybookConfigPath();

  if (file) {
    const configList = Object.entries(mergeSettings(defaultSettings, customSettings));
    const files = configList.reduce<F.ConfigFiles>((acc, [key]) => {
      return {
        ...acc,
        [key]: {
          id: key,
          location: getConfigFilePath(key),
        },
      };
    }, {});

    const defaults: F.FileName = require.resolve('../defaults/index.ts');
    const overload: F.FileName = getConfigFilePath('overload');
    const { overridePresets = [], frameworkPresets = [] } = callOptions;

    await createOverload(envOptions, cliOptions, callOptions);
    await createMain([defaults, ...frameworkPresets, file, ...overridePresets, overload]);

    await Promise.all(configList.map(createFiltered));

    return files;
  }
  return undefined;
};

export { getCacheDir, getStorybookConfigPath, getConfigFileName, getCoreDir };

export * from './types/files';
export * from './types/presets';
export * from './types/cli';
