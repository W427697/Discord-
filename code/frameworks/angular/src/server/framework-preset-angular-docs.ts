import { PresetProperty } from '@storybook/core/dist/modules/types/index';
import { hasDocsOrControls } from '@storybook/core/dist/modules/docs-tools/index';

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (entry = [], options) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, require.resolve('../client/docs/config')];
};
