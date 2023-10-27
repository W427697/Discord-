import type { PresetProperty, StorybookConfig } from '@storybook/types';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('@storybook/react-dom-shim/dist/preset'),
];
