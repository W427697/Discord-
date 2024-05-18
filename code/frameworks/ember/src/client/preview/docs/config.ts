import type { ArgTypesEnhancer } from '@storybook/core/dist/types';
import { enhanceArgTypes } from '@storybook/core/dist/docs-tools';

import { extractArgTypes, extractComponentDescription } from './jsondoc';

export const parameters: {} = {
  docs: {
    story: { iframeHeight: '80px' },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];
