import type { StorybookConfig } from '@storybook/core-common';
import { hasDocsOrControls } from '@storybook/docs-tools';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('@storybook/renderer-html/dist/esm/docs/config')];
};
