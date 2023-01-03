import type { Meta, StoryObj } from '@storybook/react';
import { Description } from './Description';
import { Button as ButtonComponent } from '../examples/Button';
import * as DefaultButtonStories from '../examples/Button.stories';
import * as ButtonStoriesWithMetaDescriptionAsParameter from '../examples/ButtonWithMetaDescriptionAsParameter.stories';
import * as ButtonStoriesWithMetaDescriptionAsComment from '../examples/ButtonWithMetaDescriptionAsComment.stories';
import * as ButtonStoriesWithMetaDescriptionAsBoth from '../examples/ButtonWithMetaDescriptionAsBoth.stories';

const meta: Meta<typeof Description> = {
  component: Description,
  parameters: {
    relativeCsfPaths: [
      '../examples/Button.stories',
      '../examples/ButtonWithMetaDescriptionAsParameter.stories',
      '../examples/ButtonWithMetaDescriptionAsComment.stories',
      '../examples/ButtonWithMetaDescriptionAsBoth.stories',
    ],
    controls: {
      include: [],
      hideNoControlsWarning: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const OfComponentAsComponentComment: Story = {
  args: {
    of: ButtonComponent,
  },
};
export const OfMetaAsComponentComment: Story = {
  args: {
    of: DefaultButtonStories.default,
  },
};
export const OfMetaAsMetaComment: Story = {
  args: {
    of: ButtonStoriesWithMetaDescriptionAsComment.default,
  },
};
export const OfMetaAsParameter: Story = {
  args: {
    of: ButtonStoriesWithMetaDescriptionAsParameter.default,
  },
};
export const OfMetaAsMetaCommentAndParameter: Story = {
  args: {
    of: ButtonStoriesWithMetaDescriptionAsBoth.default,
  },
};

export const OfStoryAsComment: Story = {
  args: {
    of: DefaultButtonStories.Primary,
  },
};
export const OfStoryAsParameter: Story = {
  args: {
    of: DefaultButtonStories.Secondary,
  },
};
export const OfStoryAsStoryCommentAndParameter: Story = {
  args: {
    of: DefaultButtonStories.Large,
  },
};
