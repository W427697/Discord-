import type { StorybookConfig } from '@junk-temporary-prototypes/types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('@junk-temporary-prototypes/react-dom-shim/dist/preset'),
];
