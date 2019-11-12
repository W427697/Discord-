import path from 'path';
import loadCustomAddons from '../utils/load-custom-addons-file';
import createDevConfig from './manager-webpack.config';

export async function managerWebpack(_, options) {
  const { presets = '../../client/manager' } = options;
  const refs = await presets.apply('refs', [], options);

  return createDevConfig({ ...options, refs });
}

export async function managerEntries(_, options) {
  const { configDir } = options;
  const { presets, managerEntry = '../../client/manager' } = options;
  const entries = [require.resolve('../common/polyfills')];

  const installedAddons = await presets.apply('addons', [], options);
  const refs = await presets.apply('refs', [], options);

  if (installedAddons && installedAddons.length) {
    entries.push(...installedAddons);
  }

  if (refs) {
    entries.push(path.resolve(path.join(configDir, `generated-refs.js`)));
  }

  entries.push(require.resolve(managerEntry));

  return entries;
}

export async function addons(_, options) {
  return loadCustomAddons(options);
}

export * from '../common/common-preset';
