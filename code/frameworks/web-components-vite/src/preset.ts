import type { PresetProperty } from '@junk-temporary-prototypes/types';
import type { StorybookConfig } from './types';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@junk-temporary-prototypes/builder-vite',
  renderer: '@junk-temporary-prototypes/web-components',
};
