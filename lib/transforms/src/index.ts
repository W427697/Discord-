export const webpack = {
  metadata: require.resolve('./webpack/sb-metadata-loader'),
  runtime: require.resolve('./webpack/sb-runtime-loader'),
};

export const babel = {
  config: require.resolve('./babel/sb-config-plugin'),
  metadata: require.resolve('./babel/sb-metadata-plugin'),
  runtime: require.resolve('./babel/sb-runtime-plugin'),
};
