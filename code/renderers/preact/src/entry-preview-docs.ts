import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/types';
import { extractComponentDescription, enhanceArgTypes } from '@storybook/docs-tools';

import { extractArgTypes } from './docs/extractArgTypes';
import { jsxDecorator } from './docs/jsxDecorator';
import type { PreactRenderer } from './types';

export const parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators: DecoratorFunction<PreactRenderer>[] = [jsxDecorator];

export const argTypesEnhancers: ArgTypesEnhancer<PreactRenderer>[] = [enhanceArgTypes];

export { applyDecorators } from './docs/applyDecorators';
