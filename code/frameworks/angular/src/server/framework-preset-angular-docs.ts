import { PresetProperty } from '@storybook/core/dist/modules/types/index';
import { hasDocsOrControls } from '@storybook/docs-tools';

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('../client/docs/config')];
};
