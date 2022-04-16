import { StorybookConfig } from '@storybook/core-common';
import { hasDocsOrControls } from '@storybook/docs-tools';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('@storybook/renderer-web-components/dist/esm/docs/config')];
};
