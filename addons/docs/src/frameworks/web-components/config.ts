import { extractArgTypes, extractComponentDescription } from './custom-elements';
import { sourceDecorator } from './sourceDecorator';
import { prepareForInline } from './prepareForInline';
import { SourceType } from '../../shared';
import { extractSnippet } from './extractSnippet';

export const decorators = [sourceDecorator];

export const parameters = {
  docs: {
    extractArgTypes,
    extractComponentDescription,
    extractSnippet,
    inlineStories: true,
    prepareForInline,
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
    },
  },
};
