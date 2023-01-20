import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from './Canvas';
import * as ButtonStories from '../examples/Button.stories';
import * as ParameterStories from '../examples/CanvasParameters.stories';

const meta: Meta<typeof Canvas> = {
  component: Canvas,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories', '../examples/CanvasParameters.stories'],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAttached: Story = {
  args: {
    of: ButtonStories.Primary,
  },
};

export const DefaultUnattached: Story = {
  args: {
    of: ButtonStories.Primary,
  },
  parameters: { attached: false },
};

export const PropWithToolbar: Story = {
  args: {
    of: ButtonStories.Primary,
    withToolbar: true,
  },
};
export const PropAdditionalActions: Story = {
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

export const PropSourceStateShown: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'shown',
  },
};

export const PropSourceStateHidden: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'hidden',
  },
};

export const PropSourceStateNone: Story = {
  args: {
    of: ButtonStories.Primary,
    sourceState: 'none',
  },
};

export const PropLayoutFullscreen: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'fullscreen',
  },
};

export const PropLayoutCentered: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'centered',
  },
};

export const PropLayoutPadded: Story = {
  args: {
    of: ButtonStories.Primary,
    layout: 'padded',
  },
};

export const ParameterDocsCanvasLayoutFullscreen: Story = {
  name: 'parameters.docs.canvas.layout = fullscreen',
  args: {
    of: ParameterStories.DocsCanvasLayoutFullscreen,
  },
};

export const ParameterDocsCanvasLayoutCentered: Story = {
  name: 'parameters.docs.canvas.layout = centered',
  args: {
    of: ParameterStories.DocsCanvasLayoutCentered,
  },
};

export const ParameterDocsCanvasLayoutPadded: Story = {
  name: 'parameters.docs.canvas.layout = padded',
  args: {
    of: ParameterStories.DocsCanvasLayoutPadded,
  },
};

export const ParameterLayoutFullscreen: Story = {
  name: 'parameters.layout = fullscreen',
  args: {
    of: ParameterStories.LayoutFullscreen,
  },
};

export const ParameterLayoutCentered: Story = {
  name: 'parameters.layout = centered',
  args: {
    of: ParameterStories.LayoutCentered,
  },
};

export const ParameterLayoutPadded: Story = {
  name: 'parameters.layout = padded',
  args: {
    of: ParameterStories.LayoutPadded,
  },
};

export const PropSource: Story = {
  args: {
    of: ButtonStories.Primary,
    source: {
      language: 'html',
      code: '<button>           Button          </button>', // spaces should be removed by the prettier formatter
      format: 'html',
    },
  },
};

export const PropInlineStory: Story = {
  args: {
    of: ButtonStories.Primary,
    story: { inline: false, height: '200px' },
  },
};

export const PropAutoplayingStory: Story = {
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
export const PropClassName: Story = {
  name: 'Prop ClassName',
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
