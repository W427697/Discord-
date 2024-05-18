import { SourceType, enhanceArgTypes } from '@storybook/core/dist/docs-tools';
import { Parameters, DecoratorFunction, ArgTypesEnhancer } from '@storybook/core/dist/types';
import { extractArgTypes, extractComponentDescription } from './compodoc';
import { sourceDecorator } from './sourceDecorator';

export const parameters: Parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
    },
  },
};

export const decorators: DecoratorFunction[] = [sourceDecorator];

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];
