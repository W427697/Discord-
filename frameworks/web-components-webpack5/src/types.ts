import type { Configuration } from 'webpack';

import type { StorybookConfig as BaseStorybookConfig } from '@storybook/preset-web-components-webpack';

export type { BuilderResult } from '@storybook/preset-web-components-webpack';

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = BaseStorybookConfig<Configuration>;
