import { extractComponentDescription, enhanceArgTypes } from '@junk-temporary-prototypes/docs-tools';

import { extractArgTypes } from './extractArgTypes';
import { jsxDecorator } from './jsxDecorator';

export const parameters = {
  docs: {
    story: { inline: true },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators = [jsxDecorator];

export const argTypesEnhancers = [enhanceArgTypes];
