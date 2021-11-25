import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from './extractComponentDescription';
import { prepareForInline } from './prepareForInline';
import { sourceDecorator } from './sourceDecorator';
import { extractSnippet } from './extractSnippet';

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
    extractSnippet,
  },
};

export const decorators = [sourceDecorator];
