import type { Plugin } from 'vite';
import type { Options } from '@storybook/types';
import fs from 'fs/promises';
import { loadCsf, enrichCsf, formatCsf } from '@storybook/csf-tools';

const STORIES_REGEX = /(?<!node_modules.*)\.(story|stories)\.[tj]sx?$/;
const logger = console;

export async function csfPlugin(config: Options): Promise<Plugin> {
  const { presets } = config;

  const addons = await presets.apply('addons', []);
  const docsOptions =
    // @ts-expect-error - not sure what type to use here
    addons.find((a) => [a, a.name].includes('@storybook/addon-docs'))?.options ?? {};

  const options = docsOptions.csfPluginOptions;

  return {
    name: 'vite-plugin-csf',
    enforce: 'pre',
    async transform(code, id) {
      if (!STORIES_REGEX.test(id)) {
        return;
      }

      const sourceCode = await fs.readFile(id, 'utf-8');
      try {
        const makeTitle = (userTitle: string) => userTitle || 'default';
        const csf = loadCsf(code, { makeTitle }).parse();
        const csfSource = loadCsf(sourceCode, {
          makeTitle,
        }).parse();
        enrichCsf(csf, csfSource, options);
        return formatCsf(csf, { sourceMaps: true });
      } catch (err: any) {
        // This can be called on legacy storiesOf files, so just ignore
        // those errors. But warn about other errors.
        if (!err.message?.startsWith('CSF:')) {
          logger.warn(err.message);
        }
        return code;
      }
    },
  };
}
