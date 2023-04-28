import { extractComponentDescription, enhanceArgTypes } from '@junk-temporary-prototypes/docs-tools';
import { extractArgTypes } from './extractArgTypes';
import { sourceDecorator } from './sourceDecorator';

export const parameters = {
  docs: {
    story: { inline: true, iframeHeight: '120px' },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators = [sourceDecorator];

export const argTypesEnhancers = [enhanceArgTypes];
