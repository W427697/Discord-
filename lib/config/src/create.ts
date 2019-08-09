import { config as configTransforms } from '@storybook/transforms';

import { mergeSettings } from './mergeSettings';

import {
  getStorybookConfigPath,
  getCacheDir,
  getConfigFileName,
  getCoreDir,
  getConfigFilePath,
} from './paths';

import { cached, write } from './persist';
import { Config, ConfigFiles } from './types/files';
import { Preset, PresetMergeAsyncFn, PresetMergeFn } from './types/presets';

const createMain = (files: string[]) => {
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

const defaultSettings: Config = {
  manager: ['theme', 'managerInit'],
  preview: ['previewInit'],
  server: ['server', 'entries', 'webpack', 'babel', 'managerWebpack', 'managerBabel'],
};

export const getStorybookConfigs = async (customSettings: Config = {}) => {
  const file = await getStorybookConfigPath();

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

    await createMain([file]);

    await Promise.all(configList.map(createFiltered));

    return files;
  }
  return undefined;
};

export { getCacheDir, getStorybookConfigPath, getConfigFileName, getCoreDir };

export { ConfigFiles, Preset, PresetMergeAsyncFn, PresetMergeFn };
