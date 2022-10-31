import { createUnplugin } from 'unplugin';
import fs from 'fs/promises';
import { loadCsf, enrichCsf, formatCsf } from '@storybook/csf-tools';

export interface CsfPluginOptions {
  source?: boolean;
  description?: boolean;
}

const STORIES_REGEX = /\.(story|stories)\.[tj]sx?$/;

const logger = console;

export const unplugin = createUnplugin<CsfPluginOptions>((options) => {
  return {
    name: 'unplugin-csf',
    enforce: 'pre',
    loadInclude(id) {
      return STORIES_REGEX.test(id);
    },
    async load(fname) {
      const code = await fs.readFile(fname, 'utf-8');
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
