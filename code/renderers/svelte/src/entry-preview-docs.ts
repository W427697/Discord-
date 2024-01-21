import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/core/dist/modules/types/index';
import { enhanceArgTypes } from '@storybook/core/dist/modules/docs-tools/index';
import { extractArgTypes } from './docs/extractArgTypes';
import { extractComponentDescription } from './docs/extractComponentDescription';
import { sourceDecorator } from './docs/sourceDecorator';
import type { SvelteRenderer } from './types';

export const parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators: DecoratorFunction<SvelteRenderer>[] = [sourceDecorator];

export const argTypesEnhancers: ArgTypesEnhancer<SvelteRenderer>[] = [enhanceArgTypes];
