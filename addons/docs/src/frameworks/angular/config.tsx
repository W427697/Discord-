import React from 'react';
import { addParameters } from '@storybook/client-api';
import { StoryFn, StoryContext } from '@storybook/addons';
import { extractArgTypes, extractComponentDescription } from './compodoc';
import toReact from './angular-to-react';

addParameters({
  docs: {
    inlineStories: true,
    prepareForInline: (storyFn: StoryFn, { args }: StoryContext) => {
      const Story = toReact(storyFn());
      return <Story {...args} />;
    },
    extractArgTypes,
    extractComponentDescription,
  },
});
