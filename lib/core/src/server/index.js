import { getStorybookConfigPath } from '@storybook/config';

export * from './preview/base-webpack.config';
export * from './utils/template';
export * from './build-static';
export * from './build-dev';

export const managerPreset = require.resolve('./manager/manager-preset');
