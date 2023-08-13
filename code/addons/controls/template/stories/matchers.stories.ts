import { global as globalThis } from '@storybook/global';
import type { PartialStoryFn, StoryContext } from '@storybook/types';

export default {
  component: globalThis.Components.Pre,
  argTypes: {
    content: {
      control: {
        type: 'nativetextarea',
      },
    },
  },
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { object: { ...context.args } } }),
  ],
};

const Template = ({ content }) => `<pre>${content}</pre>`;

export const Default = Template.bind({});
Default.args = {
  content: 'Hello World',
};
