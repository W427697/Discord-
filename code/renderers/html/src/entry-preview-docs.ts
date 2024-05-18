import type { ArgTypesEnhancer, DecoratorFunction } from '@storybook/core/dist/types';
import { SourceType, enhanceArgTypes } from '@storybook/core/dist/docs-tools';

import { sourceDecorator } from './docs/sourceDecorator';
import type { HtmlRenderer } from './types';

export const decorators: DecoratorFunction<HtmlRenderer>[] = [sourceDecorator];

export const parameters = {
  docs: {
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
      code: undefined,
      excludeDecorators: undefined,
    },
  },
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];
