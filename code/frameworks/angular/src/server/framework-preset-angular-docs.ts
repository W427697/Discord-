import { StorybookConfig } from '@junk-temporary-prototypes/types';
import { hasDocsOrControls } from '@junk-temporary-prototypes/docs-tools';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('../client/docs/config')];
};
