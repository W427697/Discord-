import type { StorybookConfig } from '@junk-temporary-prototypes/types';
import { findDistEsm } from '@junk-temporary-prototypes/core-common';
import { hasDocsOrControls } from '@junk-temporary-prototypes/docs-tools';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, findDistEsm(__dirname, 'client/docs/config')];
};
