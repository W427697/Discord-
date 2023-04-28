/* eslint-disable import/no-extraneous-dependencies */
import { logger } from '@junk-temporary-prototypes/node-logger';
import type { PluginOptions } from '../types';

const incompatiblePresets = ['@junk-temporary-prototypes/preset-scss', '@junk-temporary-prototypes/preset-typescript'];

export const checkPresets = (options: PluginOptions): void => {
  const { presetsList } = options;

  presetsList.forEach((preset: string | { name: string }) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    if (incompatiblePresets.includes(presetName)) {
      logger.warn(
        `\`${presetName}\` may not be compatible with \`@junk-temporary-prototypes/preset-create-react-app\``
      );
    }
  });
};
