import loadCustomBabelConfig from '../utils/load-custom-babel-config';

import babelConfig from './babel';

export const babel = async (_, options) => {
  const { configDir, presets } = options;
  const hasCRAPreset = options.presetsList.some(
    (preset) => (preset.name || preset) === '@storybook/preset-create-react-app'
  );

  const babelDefault = hasCRAPreset ? { presets: [], plugins: [] } : babelConfig();

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelDefault, options)
  );
};

export const logLevel = (previous, options) => previous || options.loglevel || 'info';
