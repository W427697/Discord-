import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';
import type { StoryProps } from './Story';
import { Story as StoryComponent, StorySkeleton } from './Story';
import type { DocsContextProps } from '../blocks';
import * as ButtonStories from '../examples/Button.stories';

const preview = __STORYBOOK_PREVIEW__;
const renderStoryToElement = preview.renderStoryToElement.bind(preview);

// TODO: can't quite figure out types here.
// type OverriddenStoryProps = StoryProps & {
//   story: typeof ButtonStories.Primary;
// };

const meta: Meta<typeof StoryComponent> = {
  component: StoryComponent,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
  args: {
    height: '100px',
    // NOTE: the real story arg is a PreparedStory, which we'll get in the render function below
    story: ButtonStories.Primary as any,
  },
  render(args, { loaded }) {
    const docsContext = loaded.docsContext as DocsContextProps;
    const storyId = docsContext.storyIdByModuleExport(args.story);
    const story = docsContext.storyById(storyId);
    return <StoryComponent {...args} story={story} />;
  },
};
export default meta;

export const Loading = () => <StorySkeleton />;

export const Inline = {
  args: {
    inline: true,
    autoplay: false,
    renderStoryToElement,
  },
};

export const IFrame = {
  args: {
    inline: false,
  },
};

export const Autoplay = {
  args: {
    story: ButtonStories.Clicking,
    inline: true,
    autoplay: true,
    renderStoryToElement,
  },
};
