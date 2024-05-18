import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/core/dist/types';
import { enhanceArgTypes } from '@storybook/core/dist/docs-tools';
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
