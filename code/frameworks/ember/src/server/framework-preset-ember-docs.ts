import type { PresetProperty } from '@storybook/core/dist/types';
import { hasDocsOrControls } from '@storybook/core/dist/docs-tools';
import { findDistFile } from '../util';

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, findDistFile(__dirname, 'client/preview/docs/config')];
};
