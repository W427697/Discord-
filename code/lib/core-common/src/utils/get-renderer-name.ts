import { dedent } from 'ts-dedent';
import type { Options } from '@storybook/types';

/**
 * Render is set as a string on core. It must be set by the framework
 */
export async function getRendererName(options: Options) {
  const { renderer } = await options.presets.apply('core', {}, options);

  if (!renderer) {
    throw new Error(dedent`
      You must specify a framework in '.storybook/main.js' config.

      https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#framework-field-mandatory
    `);
  }

  return renderer;
}
