import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/core/dist/modules/types/index';
import {
  extractComponentDescription,
  enhanceArgTypes,
} from '@storybook/core/dist/modules/docs-tools/index';
import { extractArgTypes } from './docs/extractArgTypes';
import { sourceDecorator } from './docs/sourceDecorator';
import type { VueRenderer } from './types';

export const parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators: DecoratorFunction<VueRenderer>[] = [sourceDecorator];

export const argTypesEnhancers: ArgTypesEnhancer<VueRenderer>[] = [enhanceArgTypes];
