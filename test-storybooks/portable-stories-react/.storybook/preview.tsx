import React from 'react';
import type { Preview } from '@storybook/react';

console.log('preview file is called!');

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [(StoryFn) => <div data-decorator>Decorator<br/>{StoryFn()}</div>],
};

export default preview;
