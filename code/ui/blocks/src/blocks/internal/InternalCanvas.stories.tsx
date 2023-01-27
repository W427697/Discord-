/// <reference types="@types/jest" />;
/// <reference types="@testing-library/jest-dom" />;
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import type { PlayFunctionContext, WebRenderer } from '@storybook/types';
import { STORY_ARGS_UPDATED, UPDATE_STORY_ARGS, RESET_STORY_ARGS } from '@storybook/core-events';
import type { Channel } from '@storybook/channels';
import { Canvas, SourceState } from '../Canvas';
import { Story as StoryComponent } from '../Story';
import * as ButtonStories from '../../examples/Button.stories';
import * as CanvasParameterStories from '../../examples/CanvasParameters.stories';
import type { DocsContextProps } from '../DocsContext';
import { SourceContainer } from '../SourceContainer';

const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__ as Channel;

const meta: Meta<typeof Canvas> = {
  component: Canvas,
  parameters: {
    theme: 'light',
    relativeCsfPaths: ['../examples/Button.stories', '../examples/CanvasParameters.stories'],
  },
  decorators: [
    (Story) => (
      <SourceContainer channel={channel}>
        <Story />
      </SourceContainer>
    ),
  ],
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={ButtonStories.Primary} />
      </Canvas>
    );
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const expectAmountOfStoriesInSource =
  (amount: number): Story['play'] =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Arrange - find the "Show code" button
    const showCodeButton = await canvas.findByText('Show code');
    await expect(showCodeButton).toBeInTheDocument();

    // Act - click button to show code
    await userEvent.click(showCodeButton);

    // Assert - check that the correct amount of stories' source is shown
    const buttonNodes = await canvas.findAllByText(`label`);
    await expect(buttonNodes).toHaveLength(amount);
  };

export const BasicStoryChild: Story = {};

export const BasicStoryChildUnattached: Story = {
  parameters: { attached: false },
};

export const NoStoryChildrenUnattached: Story = {
  parameters: { attached: false },
  render: (args) => {
    return (
      <Canvas {...args}>
        <p>This is a plain paragraph, no stories</p>
      </Canvas>
    );
  },
};
export const NoStoryChildrenUnattachedWithMDXSource: Story = {
  ...NoStoryChildrenUnattached,
  args: {
    mdxSource: `const customStaticSource = true;`,
  },
};

export const WithSourceOpen: Story = {
  args: {
    withSource: SourceState.OPEN,
  },
};
export const WithSourceClosed: Story = {
  args: {
    withSource: SourceState.CLOSED,
  },
};

export const WithMdxSource: Story = {
  name: 'With MDX Source',
  args: {
    withSource: SourceState.OPEN,
    mdxSource: `<Button
  label="Button"
  primary
  onClick={() => {
    console.log('this is custom source for the source viewer')
  }}
/>`,
  },
};

export const WithoutSource: Story = {
  args: {
    withSource: SourceState.NONE,
  },
};

export const LayoutProp: Story = {
  args: {
    layout: 'fullscreen',
  },
};

export const LayoutAsChildProp: Story = {
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={ButtonStories.Primary} parameters={{ layout: 'fullscreen' }} />
      </Canvas>
    );
  },
};

export const LayoutAsChildPropMultiple: Story = {
  args: { isColumn: true },
  render: (args) => {
    return (
      <Canvas {...args}>
        <h1>Fullscreen</h1>
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Large} parameters={{ layout: 'fullscreen' }} />
        <StoryComponent of={ButtonStories.Primary} />
      </Canvas>
    );
  },
};

export const LayoutAsParameter: Story = {
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={CanvasParameterStories.LayoutFullscreen} />
      </Canvas>
    );
  },
};

export const MultipleChildren: Story = {
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Large} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(2),
};

export const MultipleChildrenColumns: Story = {
  args: {
    isColumn: true,
  },
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Large} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(2),
};

export const MultipleChildrenThreeColumns: Story = {
  args: {
    columns: 3,
  },
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Secondary} />
        <StoryComponent of={ButtonStories.Large} />
        <StoryComponent of={ButtonStories.Large} />
        <StoryComponent of={ButtonStories.Large} />
        <StoryComponent of={ButtonStories.Primary} />
        <StoryComponent of={ButtonStories.Primary} />
        <StoryComponent of={ButtonStories.Primary} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(9),
};

export const MixedChildrenStories: Story = {
  args: { isColumn: true },
  render: (args) => {
    return (
      <Canvas {...args}>
        <h1>Headline for secondary Button</h1>
        <StoryComponent of={ButtonStories.Secondary} />
        <h1>Headline for primary Button</h1>
        <StoryComponent of={ButtonStories.Primary} />
      </Canvas>
    );
  },
  play: async (args) => {
    // this function will also expand the source code
    await expectAmountOfStoriesInSource(2)(args);
    const canvas = within(args.canvasElement);

    // Assert - only find two headlines, those in the story, and none in the source code
    expect(canvas.queryAllByText(/Headline for /i)).toHaveLength(2);
  },
};

export const ForceInitial: Story = {
  args: {
    of: ButtonStories.Primary,
    __forceInitial: true,
    sourceState: 'shown',
  },
  render: (args) => <Canvas {...args} />,
  // test that it ignores updated args by emitting an arg update and assert that it isn't reflected in the story nor source
  play: async ({ args, canvasElement, loaded }: PlayFunctionContext<WebRenderer>) => {
    const docsContext = loaded.docsContext as DocsContextProps;
    const {
      story: { id: storyId },
    } = docsContext.resolveOf(args.of, ['story']);

    // expect Button once in story, twice in Source, and 'true' in source
    await waitFor(() => expect(within(canvasElement).getAllByText('Button')).toHaveLength(3));

    const updatedPromise = new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await channel.emit(UPDATE_STORY_ARGS, {
      storyId,
      updatedArgs: { label: 'Updated' },
    });
    await updatedPromise;

    // expect no changes
    await waitFor(() => expect(within(canvasElement).getAllByText('Button')).toHaveLength(3));

    await channel.emit(RESET_STORY_ARGS, { storyId });
    await new Promise<void>((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
  },
};
