import path from 'path';
import fs from 'fs-extra';
import { config as configTransforms } from '@storybook/transforms';

import { getStorybookConfigPath, getCacheDir, getConfigFileName, getCoreDir } from './paths';
import { Config, ConfigFiles } from './types';

const write = async (location: string, name: string, content: string) => {
  const p = path.join(location, getConfigFileName(name));
  await fs.outputFile(p, content);

  return p;
};

const createFilter = (cacheDir: string, baseFileUrl: string) => async ([name, targets]: [
  string,
  string[]
]) => {
  const { code } = await configTransforms.filter(baseFileUrl, targets);
  return write(cacheDir, name, code);
};

const defaults = {
  manager: ['theme', 'managerInit'],
  preview: ['previewInit'],
  server: ['server', 'entries', 'webpack', 'babel', 'managerWebpack', 'managerBabel'],
};

export const getStorybookConfigs = async (configs: Config = {}) => {
  const file = await getStorybookConfigPath();
  const cacheDir = getCacheDir();

  if (file) {
    const { code } = await configTransforms.collector([file]);

    const baseUrl = await write(cacheDir, 'all', code);

    const filter = createFilter(cacheDir, baseUrl);

    const config: Config = Object.assign({}, configs, {
      manager: [...defaults.manager, ...(configs.manager || [])],
      preview: [...defaults.preview, ...(configs.preview || [])],
      server: [...defaults.server, ...(configs.server || [])],
    });

    return (await Promise.all(Object.entries(config).map(filter))).reduce<ConfigFiles>(
      (acc, location: string, index: number) => {
        const [key, list] = Object.entries(config)[index];
        return {
          ...acc,
          [key]: {
            id: key,
            list,
            location,
          },
        };
      },
      {}
    );
  }
  return undefined;
};

export { getCacheDir, getStorybookConfigPath, getConfigFileName, getCoreDir };

export { ConfigFiles };
