import type { StorybookConfig } from '@storybook/vite-tools';

export const addons: StorybookConfig['addons'] = ['@storybook/renderer-react'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};
