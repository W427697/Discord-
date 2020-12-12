import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from '../../lib/docgen';
import { prepareForInline } from './prepareForInline';

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
  },
};

// TODO: Implement source decorator for Vue3
// export const decorators = [sourceDecorator];
