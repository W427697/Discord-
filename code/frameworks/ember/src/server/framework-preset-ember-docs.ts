import type { PresetProperty } from '@storybook/core/dist/modules/types/index';
import { hasDocsOrControls } from '@storybook/core/dist/modules/docs-tools/index';
import { findDistFile } from '../util';

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, findDistFile(__dirname, 'client/preview/docs/config')];
};
