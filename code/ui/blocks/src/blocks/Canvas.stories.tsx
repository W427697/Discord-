import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from './Canvas';
import SourceStoriesMeta from './Source.stories';
import * as ButtonStories from '../examples/Button.stories';

const meta: Meta<typeof Canvas> = {
  component: Canvas,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
    snippets: {
      'storybook-blocks-example-button--primary': {
        code: `const emitted = 'source';`,
      },
    },
  },
  decorators: SourceStoriesMeta.decorators,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAttached: Story = {
  args: {
    of: ButtonStories.Primary,
  },
};

export const WithToolbar: Story = {
  args: {
    of: ButtonStories.Primary,
    withToolbar: true,
  },
};
export const AdditionalActions: Story = {
  args: {
    of: ButtonStories.Primary,
    additionalActions: [
      {
        title: 'Open in GitHub',
        onClick: () => {
          window.open(
            'https://github.com/storybookjs/storybook/blob/next/code/ui/blocks/src/examples/Button.stories.tsx',
            '_blank'
          );
        },
      },
      {
        title: 'Go to documentation',
        onClick: () => {
          window.open(
            'https://storybook.js.org/docs/react/essentials/controls#annotation',
            '_blank'
          );
        },
      },
    ],
  },
};

export const SourceStateShown: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'shown',
  },
};

export const SourceStateHidden: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'hidden',
  },
};

export const SourceStateNone: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'none',
  },
};

export const LayoutFullscreen: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'fullscreen',
  },
};

export const LayoutCentered: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'centered',
  },
};

export const LayoutPadded: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'padded',
  },
};

export const SourceProps: Story = {
  args: {
    of: ButtonStories.Primary,
    source: {
      language: 'html',
      code: '<button>           Button          </button>', // spaces should be removed by the prettier formatter
      format: 'html',
    },
  },
};

export const InlineStoryProps: Story = {
  args: {
    of: ButtonStories.Primary,
    story: { inline: false, height: '200px' },
  },
};

export const AutoplayingStory: Story = {
  args: {
    of: ButtonStories.Clicking,
    story: { autoplay: true },
  },
};

const ClassNameStoryDescription = () => (
  <p>
    This story sets the <code>className</code> prop on the <code>Canvas</code> to{' '}
    <code>my-custom-classname</code>, which will propagate to the preview element. To demonstrate
    this, it also adds a <code>style</code> tag that sets another background color for that class:
  </p>
);
/**
 * This is a comment on classname
 */
export const ClassName: Story = {
  name: 'ClassName',
  args: {
    of: ButtonStories.Primary,
    className: 'my-custom-classname',
  },
  render: (args) => (
    <>
      <ClassNameStoryDescription />
      <style>
        {`
          .my-custom-classname {
            background-color: #fd5c9355;
          }
        `}
      </style>
      <Canvas {...args} />
    </>
  ),
};
