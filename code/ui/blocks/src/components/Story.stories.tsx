import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ModuleExport } from '@storybook/types';
import type { StoryProps } from './Story';
import { Story as StoryComponent, StorySkeleton } from './Story';
import type { DocsContextProps } from '../blocks';
import * as ButtonStories from '../examples/Button.stories';

const preview = __STORYBOOK_PREVIEW__;
const renderStoryToElement = preview.renderStoryToElement.bind(preview);

type ExtendedStoryProps = Omit<StoryProps, 'story'> & {
  storyExport: ModuleExport;
};

const meta: Meta<ExtendedStoryProps> = {
  // @ts-expect-error getting too complex with props
  component: StoryComponent,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
  args: {
    height: '100px',
    // NOTE: the real story arg is a PreparedStory, which we'll get in the render function below
    storyExport: ButtonStories.Primary as any,
  },
  render({ storyExport, ...args }, { loaded }) {
    const docsContext = loaded.docsContext as DocsContextProps;
    const storyId = docsContext.storyIdByModuleExport(storyExport);
    const story = docsContext.storyById(storyId);
    // @ts-expect-error getting too complex with props
    return <StoryComponent {...args} story={story} />;
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading = () => <StorySkeleton />;

export const Inline: Story = {
  args: {
    inline: true,
    // @ts-expect-error getting too complex with props
    autoplay: false,
    renderStoryToElement,
  },
};

export const IFrame: Story = {
  args: {
    inline: false,
  },
};

export const Autoplay: Story = {
  args: {
    storyExport: ButtonStories.Clicking,
    inline: true,
    // @ts-expect-error getting too complex with props
    autoplay: true,
    renderStoryToElement,
  },
};
