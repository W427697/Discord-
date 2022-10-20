import { TransformOptions } from '@babel/core';

export const configureTypescript = async (baseConfig: TransformOptions) => {
  // TODO: add a check so we only add this in typescript projects
  const isTypescript = true;

  baseConfig.presets ||= [];

  if (isTypescript && !baseConfig.presets.includes('@babel/preset-typescript')) {
    baseConfig.presets.push('@babel/preset-typescript');
  }
};
