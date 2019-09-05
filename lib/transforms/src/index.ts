import { format } from 'prettier';
import { resolvePrettierConfig } from './utils/prettier-config';

import { collector } from './modules/collector';
import { filter } from './modules/filter';

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
  filter,
};

export const prettier = async (code: string) => {
  const prettierConfig = await resolvePrettierConfig(__filename);

  return format(code, { ...prettierConfig, parser: 'babel' });
};
