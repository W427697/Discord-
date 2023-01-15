import React from 'react';
import type { Meta } from '@storybook/react';
import { within } from '@storybook/testing-library';
import type { PlayFunctionContext } from '@storybook/csf';
import type { WebRenderer } from '@storybook/types';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events';

import { Story as StoryComponent, StorySkeleton } from './Story';
import type { DocsContextProps } from '../blocks';
import * as ButtonStories from '../examples/Button.stories';

const preview = __STORYBOOK_PREVIEW__;
const renderStoryToElement = preview.renderStoryToElement.bind(preview);

const meta: Meta = {
  component: StoryComponent,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
  args: {
    height: '100px',
    storyExport: ButtonStories.Primary,
    autoplay: false,
    ignoreArgsUpdates: false,
  },
  render(args, { loaded }) {
    const docsContext = loaded.docsContext as DocsContextProps;
    const storyId = docsContext.storyIdByModuleExport(args.storyExport);
    const story = docsContext.storyById(storyId);
    return <StoryComponent {...(args as any)} story={story} />;
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

export const ForceInitialArgs = {
  args: {
    storyExport: ButtonStories.Primary,
    inline: true,
    autoplay: true,
    forceInitialArgs: true,
    renderStoryToElement,
  },
  // test that it ignores updated args by emitting an arg update and assert that it isn't reflected in the DOM
  play: async ({ args, canvasElement, loaded }: PlayFunctionContext<WebRenderer>) => {
    const docsContext = loaded.docsContext as DocsContextProps;
    const storyId = docsContext.storyIdByModuleExport(args.storyExport);

    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await within(canvasElement).findByText(/Button/);

    const updatedPromise = new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs: { label: 'Updated' } });
    await updatedPromise;
    await within(canvasElement).findByText(/Button/);

    await channel.emit(RESET_STORY_ARGS, { storyId });
    await new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
  },
};

export const Autoplay = {
  args: {
    storyExport: ButtonStories.Clicking,
    inline: true,
    autoplay: true,
    renderStoryToElement,
  },
};
