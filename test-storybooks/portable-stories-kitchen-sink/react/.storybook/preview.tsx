import type { Preview } from '@storybook/react';

console.log('preview file is called!');

const preview: Preview = {
  decorators: [
    (StoryFn) => (
      <div data-testid="global-decorator">
        Global Decorator
        <br />
        {StoryFn()}
      </div>
    ),
  ],
};

export default preview;
