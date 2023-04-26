import { SourceType, enhanceArgTypes } from '@storybook/docs-tools';

import { sourceDecorator } from './sourceDecorator';
import type { Parameters } from '../types';

export const decorators = [sourceDecorator];

export const parameters: Partial<Parameters> = {
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

export const argTypesEnhancers = [enhanceArgTypes];
