import { collector } from './modules/collector';

export const webpack = {
  metadata: require.resolve('./webpack/sb-metadata-loader'),
  runtime: require.resolve('./webpack/sb-runtime-loader'),
};

export const babel = {
  metadata: require.resolve('./babel/sb-metadata-plugin'),
  runtime: require.resolve('./babel/sb-runtime-plugin'),
};

export const config = {
  collector,
};
