import type { Configuration, EntryObject, WebpackPluginFunction } from 'webpack';
import { logger } from '@storybook/node-logger';
import WebpackVirtualModules from 'webpack-virtual-modules';

type VirtualModules = Record<string, string>;

interface FinalEntries {
  entries: EntryObject;
  virtualModules: VirtualModules;
}

const sampleEntry: EntryObject = {};

type EntryDescription = typeof sampleEntry.sample;

export const checkForModuleFederation = (config: Configuration): boolean =>
  !!config?.plugins?.find(
    (plugin: WebpackPluginFunction) => plugin.constructor.name === 'ModuleFederationPlugin'
  );

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

const getBootstrapValues = (value: EntryDescription): string => {
  if (typeof value === 'string') {
    return `import '${value}';`;
  }

  if (Array.isArray(value)) {
    return value.map((entryFile) => `import '${entryFile}';`).join('\n');
  }

  if (Array.isArray(value.import)) {
    return value.import.map((entryFile: string) => `import '${entryFile}';`).join('\n');
  }

  return `import '${value.import}';`;
};

const createEntries = (entry: EntryObject): FinalEntries =>
  Object.entries(entry).reduce(
    (acc: FinalEntries, [key, value]) => {
      const entryFile = `./__entry_${key}.js`;

      if (Array.isArray(value) || typeof value === 'string') {
        acc.entries[key] = entryFile;
      } else if (value.import) {
        acc.entries[key] = { ...value, import: entryFile };
      }

      acc.virtualModules[entryFile] = `import('./__bootstrap_${key}.js');`;
      acc.virtualModules[`./__bootstrap_${key}.js`] = getBootstrapValues(value);

      return acc;
    },
    { entries: {}, virtualModules: {} }
  );

export const enableModuleFederation = async (config: Configuration): Promise<Configuration> => {
  try {
    /* eslint-disable no-param-reassign */
    logger.info('=> Module Federation detected, creating async barrier');
    const entry = await getEntries(config);

    const { entries, virtualModules } = createEntries(entry);

    config.plugins.unshift(new WebpackVirtualModules(virtualModules));

    config.entry = entries;

    if (config.optimization?.runtimeChunk) {
      logger.info(
        '=> Turning off runtimeChunk optimization as it interferes with Module Federation'
      );
      config.optimization.runtimeChunk = false;
    }

    if (typeof config.output?.publicPath === 'string' && config.output?.publicPath === '') {
      logger.info(
        '=> Setting publicPath to undefined. An empty string will prevent correct chunk resolution for federated modules'
      );
      delete config.output.publicPath;
    }
  } catch (error) {
    logger.error(
      '=> Error thrown while enabling Module Federation. Returning unmodified configuration'
    );
    logger.error(error.message);
  }

  return config;
};
