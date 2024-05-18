import type { PresetProperty } from '@storybook/core/dist/types';

import { dirname, join } from 'path';

export const addons: PresetProperty<'addons'> = [
  require.resolve('@storybook/react-dom-shim/dist/preset'),
];

export const previewAnnotations: PresetProperty<'previewAnnotations'> = async (
  input = [],
  options
) => {
  const docsConfig = await options.presets.apply('docs', {}, options);
  const docsEnabled = Object.keys(docsConfig).length > 0;
  const result: string[] = [];

  return result
    .concat(input)
    .concat([join(__dirname, 'entry-preview.mjs')])
    .concat(docsEnabled ? [join(__dirname, 'entry-preview-docs.mjs')] : [])
    .concat(FEATURES?.experimentalRSC ? [join(__dirname, 'entry-preview-rsc.mjs')] : []);
};

/**
 * Try to resolve react and react-dom from the root node_modules of the project
 * addon-docs uses this to alias react and react-dom to the project's version when possible
 * If the user doesn't have an explicit dependency on react this will return the existing values
 * Which will be the versions shipped with addon-docs
 *
 * We do the exact same thing in the common preset, but that will fail in Yarn PnP because
 * @storybook/core-server doesn't have a peer dependency on react
 * This will make @storybook/react projects work in Yarn PnP
 */
export const resolvedReact = async (existing: any) => {
  try {
    return {
      ...existing,
      react: dirname(require.resolve('react/package.json')),
      reactDom: dirname(require.resolve('react-dom/package.json')),
    };
  } catch (e) {
    return existing;
  }
};
