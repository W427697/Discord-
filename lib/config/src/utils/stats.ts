import { Webpack } from '../types/values';

export const stats: Webpack['stats'] = {
  errorDetails: true,
  errors: true,
  warnings: true,
  colors: false,
  entrypoints: true,
  modules: false,
  assets: false,
  reasons: false,
  source: false,
};
