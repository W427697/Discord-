import type { Configuration, EntryObject } from 'webpack';
import { logger } from '@storybook/node-logger';
import WebpackVirtualModules from 'webpack-virtual-modules';

export const checkForModuleFederation = (config: Configuration): boolean =>
  !!config?.plugins?.find((plugin: any) => plugin.constructor.name === 'ModuleFederationPlugin');

const getEntries = async (config: Configuration): Promise<EntryObject> => {
  const { entry } = config;

  if (!entry) {
    return { main: [] };
  }

  if (typeof entry === 'function') {
    const dynamicEntry = await entry();
    return getEntries({ entry: dynamicEntry });
  }

  if (typeof entry === 'string') {
    return { main: [entry] };
  }

  if (Array.isArray(entry)) {
    return { main: entry };
  }

  return Object.entries(entry).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      return { ...acc, [key]: [value] };
    }

    return { ...acc, [key]: value };
  }, {});
};

const getBootstrapValues = (value: any) => {
  if (Array.isArray(value)) {
    return value.map((entryFile) => `import '${entryFile}';`).join('\n');
  }

  return `import '${value.import}';`;
};

const createVirtualModules = (entry: EntryObject) =>
  Object.entries(entry).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [`./__entry_${key}.js`]: `import('./__bootstrap_${key}.js');`,
      [`./__bootstrap_${key}.js`]: getBootstrapValues(value),
    };
  }, {});

export const enableModuleFederation = async (config: Configuration): Promise<Configuration> => {
  logger.info('=> Module Federation detected, creating async barrier');

  const newConfig = { ...config };

  const entry = await getEntries(newConfig);
  const virtualModules = createVirtualModules(entry);
  const finalEntries = Object.keys(virtualModules).filter((key) => key.includes('__entry'));

  newConfig.plugins.unshift(new WebpackVirtualModules(virtualModules));

  newConfig.entry = finalEntries;

  if (newConfig?.optimization?.runtimeChunk) {
    logger.info('=> Turning off runtimeChunk optimization as it interferes with Module Federation');
    newConfig.optimization.runtimeChunk = false;
  }

  if (typeof newConfig.output?.publicPath === 'string' && newConfig.output?.publicPath === '') {
    logger.info(
      '=> Setting publicPath to undefined. An empty string will prevent correct chunk resolution for federated modules'
    );
    delete newConfig.output.publicPath;
  }

  return newConfig;
};
