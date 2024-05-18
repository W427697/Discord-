import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/core/dist/types';
import { SourceType, enhanceArgTypes } from '@storybook/core/dist/docs-tools';
import { extractArgTypes, extractComponentDescription } from './docs/custom-elements';
import { sourceDecorator } from './docs/sourceDecorator';
import type { WebComponentsRenderer } from './types';

export const decorators: DecoratorFunction<WebComponentsRenderer>[] = [sourceDecorator];

export const parameters = {
  docs: {
    extractArgTypes,
    extractComponentDescription,
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
    },
  },
};

export const argTypesEnhancers: ArgTypesEnhancer<WebComponentsRenderer>[] = [enhanceArgTypes];
