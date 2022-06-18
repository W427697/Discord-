import { SourceType } from '@storybook/docs-tools';
import { sourceDecorator } from './sourceDecorator';

export const decorators = [sourceDecorator];

export const parameters = {
  docs: {
    inlineStories: true,
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
    },
  },
};
