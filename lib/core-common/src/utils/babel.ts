import { TransformOptions } from '@babel/core';

export const getStorybookBabelConfig = () => {
  return {
    sourceType: 'unambiguous',
    presets: [],
    plugins: [],
  } as TransformOptions;
};
