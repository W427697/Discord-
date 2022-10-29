import { createUnplugin } from 'unplugin';
import { loadCsf, enrichCsf, formatCsf } from '@storybook/csf-tools';

export interface CsfPluginOptions {
  source?: boolean;
}

const STORIES_REGEX = /\.(story|stories)\.[tj]sx?$/;

const logger = console;

export const unplugin = createUnplugin((options: CsfPluginOptions) => {
  return {
    name: 'unplugin-csf',
    transformInclude(id) {
      return STORIES_REGEX.test(id);
    },
    transform(code) {
      try {
        const csf = loadCsf(code, { makeTitle: (userTitle) => userTitle || 'default' }).parse();
        enrichCsf(csf);
        return formatCsf(csf);
      } catch (err: any) {
        logger.warn(err.message);
        return code;
      }
    },
  };
});

export const { vite, rollup, webpack, esbuild } = unplugin;
