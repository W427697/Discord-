import { loadCsf, enrichCsf, formatCsf } from '@storybook/csf-tools';
import fs from 'fs/promises';
import type { Plugin } from 'vite';
import type { CsfOptions } from '.';

const STORIES_REGEX = /\.(story|stories)\.[tj]sx?$/;

const logger = console;

function CsfVitePluginFn(options: CsfOptions = {}): Plugin {
  return {
    name: 'csf-vite-plugin',

    async transform(code: string, id: string) {
      if (!STORIES_REGEX.test(id)) {
        return null;
      }

      try {
        const originalCode = await fs.readFile(id, 'utf-8');
        const csf = loadCsf(code, originalCode, {
          makeTitle: (userTitle) => userTitle || 'default',
        }).parse();
        enrichCsf(csf, options);
        const result = formatCsf(csf, { sourceMaps: true });
        if (typeof result === 'string') {
          return result;
        }
        return {
          code: result.code,
          map: result.map,
        };
      } catch (err: any) {
        if (!err.message?.startsWith('CSF:')) {
          logger.warn(err.message);
        }
        return {
          code,
        };
      }
    },
  };
}

export default CsfVitePluginFn as any;
